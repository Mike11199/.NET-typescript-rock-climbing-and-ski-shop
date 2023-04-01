// import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPageComponent from "./LoginPageComponent";
// import { BrowserRouter as Router } from "react-router-dom";
import { MemoryRouter as Router } from "react-router-dom";
// import renderer from "react-test-renderer";

let loginUserApiRequest = () => {
  return new Promise((resolve, reject) => {
    resolve({
      success: "user logged in",
      userLoggedIn: {
        _id: "hd73hDsSDj",
        name: "John",
        lastName: "Doe",
        email: "admin@admin.com",
        isAdmin: true,
        doNotLogout: false,
      },
    });
  });
};

let loginUserApiRequestError = () => {
  return new Promise((resolve, reject) => {
    reject({
      response: {
        data: {
          message: "wrong credentials",
        },
      },
    });
  });
};


  // Mock the document object
  // const mockDocument = {
  //   querySelector: jest.fn().mockReturnValue({
  //     classList: {
  //       add: jest.fn(),
  //       remove: jest.fn(),
  //     },
  //     addEventListener: jest.fn(),
  //   }),
  // };


const assign = window.location.assign;  //real assign function



// this runs before testing to set mock implementations of functions 
beforeAll(() => {
 

 //create mock function for window.location.assign real function
  Object.defineProperty(window, "location", {  
    value: { assign: jest.fn() },
  });


  // remove this as prevented code to shake css password box if node env is testing - shakes only works in prod now which uses querySelector

  // jest.spyOn(document, "querySelector").mockImplementation(() => ({
  //   classList: {
  //     add: jest.fn(),
  //     remove: jest.fn(),
  //   },
  //   addEventListener: jest.fn(),
  // }));

  //mock implementation of matchMedia function as was breaking when testing toast notifications with react-hot-toast - reference ChatGPT help
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn()
  }));


});

  

afterAll(() => {
  window.location.assign = assign;  //after tests go back to normal
  jest.restoreAllMocks();
});



test("if admin is logged in", async () => {

  // const querySelectorSpy = jest.spyOn(document, "querySelector");
  // const addEventListenerSpy = jest.spyOn(document, "addEventListener");

  render(
    <Router>
      <LoginPageComponent loginUserApiRequest={loginUserApiRequest} reduxDispatch={() => {}} setReduxUserState={() => {}} />
    </Router>
  );
  await screen.findByLabelText("Email address");
  expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByText("Login", { selector: "button" })).toBeInTheDocument();

  
  const emailField = screen.getByLabelText("Email address");
  const passwordField = screen.getByPlaceholderText('Password');
  const submitButton = screen.getByText("Login", { selector: "button" });

  fireEvent.focus(emailField);
  fireEvent.change(emailField, { target: { value: "admin@admin.com" } });
  fireEvent.blur(emailField);
  fireEvent.focus(passwordField);
  fireEvent.change(passwordField, { target: { value: "admin@admin.com" } });
  fireEvent.blur(passwordField);

  fireEvent.click(submitButton);

  await screen.findByLabelText("Email address");
  // console.log(passwordField); // Add this line
  expect(window.location.assign).toHaveBeenCalledWith("/admin/orders");
});





test("if wrong credentials toast notification modification", async () => {
  render(
    <Router>
      <LoginPageComponent loginUserApiRequest={loginUserApiRequestError} reduxDispatch={() => {}} setReduxUserState={() => {}} />
    </Router>
  );
  await screen.findByLabelText("Email address");
  expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByText("Login", { selector: "button" })).toBeInTheDocument();

  const emailField = screen.getByLabelText("Email address");
  const passwordField = screen.getByPlaceholderText('Password');
  const submitButton = screen.getByText("Login", { selector: "button" });

  fireEvent.focus(emailField);  //to place cursor on a field
  fireEvent.change(emailField, { target: { value: "admin@admin.com" } });
  fireEvent.blur(emailField);  //to click somewhere outside of field
  
  fireEvent.focus(passwordField);
  fireEvent.change(passwordField, { target: { value: "admin@admin.com" } });
  fireEvent.blur(passwordField);

  fireEvent.click(submitButton);

  
  await screen.findByText(/Wrong credentials/i);
  // console.log('Found element:', await screen.findByText(/Wrong credentials/i));
  expect(screen.getByText(/Wrong credentials/i)).toBeInTheDocument();
});

// test("create login snapshot", () => {
//     const tree = renderer.create(
//         <Router>
//             <LoginPageComponent loginUserApiRequest={loginUserApiRequest} reduxDispatch={() => {}} setReduxUserState={() => {}} />
//         </Router>
//     ).toJSON();
//     expect(tree).toMatchSnapshot();
// })