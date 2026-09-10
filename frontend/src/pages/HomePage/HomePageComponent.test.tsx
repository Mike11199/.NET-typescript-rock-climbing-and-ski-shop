/* eslint-disable testing-library/prefer-find-by */

//**THIS IS AN EXAMPLE OF HOW TO TEST A COMPONENT SPLIT INTO TWO FILES - API AND COMPONENT PART - THIS TESTS PURELY THE COMPONENT W/ MOCK API DATA*****************//

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePageComponent from "./HomePageComponent";
import { MemoryRouter as Router } from "react-router-dom"; //as useNavigate called in other components in home page (MemoryRouter faster than BrowserRouter)

//*******************************MOCK DATA*********************************************//

//FAKE data as opposed to API call that we can pass to tests
let categories = [];

//FAKE data as opposed to API call that we can pass to tests
let getBestsellers = () => {
  return new Promise((resolve, reject) => {
    resolve([
      {
        _id: "6315f5f6b4ab1404dc103427",
        name: "La Sportiva Nepal EVO GTX Mountaineering Boot - Men's",
        description:
          "Gore-Tex polyester lined and insulated mountaineering boots with Vibram rubber outsoles.  Crampon compatible.",
        category: "Boots/Climbing/Sportiva",
        images: [{ path: "path" }],
      },
    ]);
  });
};

//***************************TESTS ARE BELOW HERE************************************//

//test that the catch function works in the front end if an error with the API - if the promise rejects instead of resolves
let getBestsellersError = () => {
  return new Promise((resolve, reject) => {
    reject({
      response: {
        data: {
          message: "Product is not defined",
        },
      },
    });
  });
};

test("if category is seen", async () => {
  render(
    <Router>
      <HomePageComponent
        categories={categories}
        getBestsellers={getBestsellers}
      />
    </Router>,
  );
  await waitFor(() => screen.getByText(/Boots\/Climbing\/Sportiva/i)); // i means case insensitive
  expect(screen.getByText(/Boots\/Climbing\/Sportiva/i)).toBeInTheDocument();
  // expect(screen.getByRole("heading", { name: /Boots\/Climbing\/Sportiva/i }));   //to get text from header
});

test("if error is seen", async () => {
  render(
    <Router>
      <HomePageComponent
        categories={categories}
        getBestsellers={getBestsellersError}
      />
    </Router>,
  );

  await waitFor(() => screen.getByText(/Product is not defined/i));
  expect(screen.getByText(/Product is not defined/i)).toBeInTheDocument();
});
