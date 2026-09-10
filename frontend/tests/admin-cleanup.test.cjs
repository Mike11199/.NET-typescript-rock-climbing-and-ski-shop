// Unit tests run the actual TSX components with external UI/services replaced by test doubles.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const renderer = require("react-test-renderer");
const router = require("react-router-dom");
const h = React.createElement;
const { act } = renderer;
const component = (name) => (props) => h(name, props, props.children);
const Form = component("form");
Form.Group = component("fieldset");
Form.Label = component("label");
Form.Control = component("input");
Form.Control.Feedback = component("feedback");
const NavDropdown = component("dropdown");
NavDropdown.Item = component("menuitem");
const Nav = component("nav");
Nav.Link = component("navlink");
const bootstrap = {
  Form,
  Nav,
  NavDropdown,
  Row: component("row"),
  Col: component("col"),
  Button: component("button"),
  Badge: component("badge"),
};

function load(file, modules = {}, globals = {}) {
  const filename = path.join(__dirname, "../src", file);
  const js = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  const output = { exports: {} };
  const context = {
    module: output,
    exports: output.exports,
    React,
    console: { ...console, log() {} },
    window: { addEventListener() {}, removeEventListener() {} },
    document: { querySelector: () => null },
    require(id) {
      if (id in modules) return modules[id];
      if (id === "react") return React;
      if (id === "react-bootstrap") return bootstrap;
      if (id === "react-bootstrap/Spinner") return component("spinner");
      if (id === "@react-hook/window-size")
        return { useWindowWidth: () => 1024 };
      if (/\.(png|css)$/.test(id)) return id;
      throw Error(`Unexpected dependency: ${id}`);
    },
    ...globals,
  };
  vm.runInNewContext(js, context, { filename });
  return output.exports;
}

for (const isAdmin of [false, true, 1]) {
  test(`password login sends account isAdmin=${isAdmin} to /user`, async () => {
    const destinations = [],
      timers = [],
      dispatched = [];
    const Login = load(
      "pages/LoginPage/LoginPageComponent.tsx",
      {
        "react-router-dom": { Link: component("link") },
        "../../../src/components/GoogleLogIn": component("google"),
        "../../../src/utils/ToastNotifications": {
          toastSuccess() {},
          toastError() {},
        },
      },
      {
        setTimeout: (fn) => timers.push(fn),
        window: { location: { assign: (url) => destinations.push(url) } },
      },
    ).default;
    const user = { name: "Test", isAdmin };
    let tree;
    act(() => {
      tree = renderer.create(
        h(Login, {
          loginUserApiRequest: async () => ({
            success: "user logged in",
            userLoggedIn: user,
          }),
          reduxDispatch: (value) => dispatched.push(value),
          setReduxUserState: (value) => value,
        }),
      );
    });
    await act(async () => {
      await tree.root.findByType("form").props.onSubmit({
        preventDefault() {},
        stopPropagation() {},
        currentTarget: {
          elements: {
            email: { value: "test@example.com" },
            password: { value: "test-only" },
            doNotLogout: { checked: false },
          },
        },
      });
    });
    timers.forEach((fn) => fn());
    assert.deepEqual(destinations, ["/user"]);
    assert.equal(dispatched[0], user);
    act(() => tree.unmount());
  });
}

for (const scenario of ["customer", "legacy-admin", "invalid", "missing"]) {
  test(`google login handles ${scenario}`, async () => {
    const navigated = [],
      dispatched = [],
      errors = [];
    const Google = load("components/GoogleLogIn.tsx", {
      "@react-oauth/google": {
        GoogleOAuthProvider: component("oauth"),
        GoogleLogin: component("google"),
      },
      "../redux/actions/userActions": { setReduxUserState: (value) => value },
      "react-router-dom": {
        useNavigate: () => (url, options) =>
          navigated.push([url, options.replace]),
      },
      "../../src/utils/ToastNotifications": {
        toastError: (message) => errors.push(message),
      },
    }).default;
    const valid = scenario === "customer" || scenario === "legacy-admin";
    const response =
      scenario === "missing"
        ? undefined
        : {
            success: valid ? "user logged in" : "failed",
            userLoggedIn: {
              name: "Test",
              isAdmin: scenario === "legacy-admin",
            },
          };
    let tree;
    act(() => {
      tree = renderer.create(
        h(Google, {
          googleLogin: async () => response,
          reduxDispatch: (value) => dispatched.push(value),
        }),
      );
    });
    await act(async () => {
      await tree.root
        .findByType("google")
        .props.onSuccess({ credential: "test-only" });
    });
    assert.deepEqual(navigated, valid ? [["/user", true]] : []);
    assert.equal(dispatched.length, valid ? 1 : 0);
    assert.equal(errors.length, valid ? 0 : 1);
    act(() => tree.unmount());
  });
}

test("legacy admin accounts receive customer navigation and logout", () => {
  const state = {
    userRegisterLogin: {
      userInfo: { name: "Test", lastName: "Account", isAdmin: true },
    },
    cart: { itemsCount: 2 },
  };
  const dispatched = [];
  const Header = load("components/header/HeaderNavLinks.tsx", {
    "react-router-bootstrap": { LinkContainer: component("link-container") },
    "react-router-dom": { Link: component("link") },
    "react-redux": {
      useSelector: (selector) => selector(state),
      useDispatch: () => (value) => dispatched.push(value),
    },
    "../../redux/actions/userActions": { logout: () => "LOGOUT" },
  }).default;
  let tree;
  act(() => {
    tree = renderer.create(h(Header));
  });
  const items = tree.root.findAllByType("menuitem");
  assert.deepEqual(
    items.map((item) => item.props.children),
    ["My orders", "My profile", "Logout"],
  );
  assert.equal(items[0].props.to, "/user/my-orders");
  assert.equal(items[1].props.to, "/user");
  act(() => {
    items[2].props.onClick();
  });
  assert.deepEqual(dispatched, ["LOGOUT"]);
  assert.ok(!JSON.stringify(tree.toJSON()).includes("/admin"));
  act(() => tree.unmount());
});

for (const url of [
  "/admin/orders",
  "/admin/users",
  "/admin/edit-user/1",
  "/admin/products",
  "/admin/create-new-product",
  "/admin/edit-product/1",
  "/admin/order-details/1",
  "/admin/chats",
  "/admin/analytics",
]) {
  test(`${url} redirects to the customer profile`, () => {
    const source = fs.readFileSync(
      path.join(__dirname, "../src/App.tsx"),
      "utf8",
    );
    const modules = {};
    for (const [, name] of source.matchAll(/from "(\.[^"]+)"/g)) {
      modules[name] = name.includes("AxiosSetup") ? () => {} : component(name);
    }
    modules["react-hot-toast"] = { Toaster: component("toaster") };
    modules["react-router-dom"] = {
      ...router,
      BrowserRouter: (props) =>
        h(router.MemoryRouter, { initialEntries: [url] }, props.children),
    };
    const App = load("App.tsx", modules).default;
    let tree;
    act(() => {
      tree = renderer.create(h(App));
    });
    assert.equal(
      tree.root.findAllByType("./pages/user/UserProfilePage").length,
      1,
    );
    act(() => tree.unmount());
  });
}
