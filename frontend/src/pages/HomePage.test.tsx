/* eslint-disable testing-library/prefer-find-by */
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter as Router } from "react-router-dom";
import HomePage from "./HomePage";
import * as reactRedux from "react-redux";

//mock entire library
const axios = require("axios");
jest.mock("axios");

//mock particular method from object - not entire library
const useSelectorMock = jest.spyOn(reactRedux, "useSelector");

beforeEach(() => {
  useSelectorMock.mockClear();
});

//to use to mock useSelector
var mockState = {
  categories: [],
};

test("if product name is seen", async () => {
 
  // mock useSelector
  useSelectorMock.mockReturnValue(mockState);  
  
  // mock axios return from get 
  axios.get.mockResolvedValue({
    data: [
      {
        _id: "6315f5f6b4ab1404dc103427",
        name: "Atomic Skis",
        description:
          "Product test Description Lorem ipsum dolor sit amet con…ccusantium nihil exercitationem autem porro esse.",
        category: "Skis",
        images: [{ path: "path" }],
      },
    ],
  });


  render(
    <Router>
      <HomePage />
    </Router>
  );
  await waitFor(() => screen.getByText(/Product test Description/i));
  expect(screen.getByText(/Product test Description/i)).toBeInTheDocument();
});
