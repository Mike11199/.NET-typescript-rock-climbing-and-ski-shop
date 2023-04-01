import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Counter from "./exampleComponent";

// name of this file has to be .test.js to be found by jest if it is not in the __tests__ folder

test("counter test, not part of the e-comm app", () => {
  render(<Counter />);
 
  expect(screen.getByText("Decrement")).toBeInTheDocument();
  
  const increment = screen.getByText("Increment");
  const decrement = screen.getByText("Decrement");
  const message = screen.getByText(/Current count/);  //regular expression
 
  fireEvent.click(increment) 
  expect(message.textContent).toBe('Current count: 1')
  
  fireEvent.click(decrement)
  fireEvent.click(decrement)
  fireEvent.click(decrement)
  fireEvent.click(decrement)


  expect(message.textContent).toBe('Current count: -3')

  // for (let index = 0; index < 10000; index++) {
  //   fireEvent.click(increment) 
    
  // }
  
  // expect(message.textContent).toBe('Current count: 9997')


});
