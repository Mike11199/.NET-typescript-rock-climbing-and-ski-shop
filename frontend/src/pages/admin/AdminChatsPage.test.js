import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter as Router } from "react-router-dom";
import AdminChatsPage from "./AdminChatsPage";
import * as reactRedux from "react-redux";

// use Jest spyOn to create a mock - the same function as real redux one
const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");

//before each test file clear the mock to reset fake redux objects - as may have other fake redux state in other tests
beforeEach(() => {
  useSelectorMock.mockClear();
  useDispatchMock.mockClear();
});

//  some examples of built in functions to run before/foreach/after tests are the below three:

// afterEach(() => {})
// beforeAll(() => {})
// afterAll(() => {})



//this is a mock state that is passed into the mock useSelectorMock function 
//it contains mock values for redux states such as chatRooms.  e.g - one room will contain a chat message from a user sent to the admin to be tested for
let mockState = {
    chatRooms: {
    XOjxq8WG7WgCoFD_AAAI: [
      {
        client: "Hello! I need help with a product!",
      },
    ],
  },
  socket: { connected: true },
}

test("if chat message is seen", async () => {
    useSelectorMock.mockReturnValue(mockState)   //pass in mock state for test to mock useSelector(); contains mock state variables like chatRooms and socket
    render(
    <Router>
      <AdminChatsPage />
    </Router>
  );
  // eslint-disable-next-line testing-library/prefer-find-by
  await waitFor(() => screen.getByText(/Hello! I need help with a product!/i));
  expect(screen.getByText(/Hello! I need help with a product!/i)).toBeInTheDocument();
})