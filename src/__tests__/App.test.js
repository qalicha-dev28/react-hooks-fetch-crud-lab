import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";

import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  // Ensure the initial fetch completes and the list is visible
  await screen.findByText(/lorem testum 1/g);

  // No need to click "View Questions" if it's the default view after fetch
  // fireEvent.click(screen.queryByText(/View Questions/)); // This might be redundant if list is default

  expect(screen.getByText(/lorem testum 1/g)).toBeInTheDocument(); // Use getByText as it should be there immediately
  expect(screen.getByText(/lorem testum 2/g)).toBeInTheDocument(); // Use getByText
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // Wait for initial questions to load before interacting
  await screen.findByText(/lorem testum 1/g);

  // Click "New Question" button to show the form
  fireEvent.click(screen.queryByText("New Question"));

  // Wait for the form to appear (e.g., by finding its prompt input)
  await screen.findByLabelText(/Prompt/);

  // Fill out form fields
  fireEvent.change(screen.queryByLabelText(/Prompt/), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 1/), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 2/), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.queryByLabelText(/Correct Answer/), {
    target: { value: "1" },
  });

  // Submit the form and await the asynchronous operations (fetch, state updates, re-render)
  await fireEvent.submit(screen.queryByText(/Add Question/));

  // --- IMPORTANT FIX HERE ---
  // Remove the redundant click. The onSubmissionComplete callback in QuestionForm
  // should already switch the view back to the QuestionList.
  // fireEvent.click(screen.queryByText(/View Questions/));

  // Now, wait for the new prompt to appear in the list, which indicates the list has re-rendered
  // with the new question and the view has switched.
  expect(await screen.findByText(/Test Prompt/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 1/g);

  // Await the click event that triggers a fetch and state update
  await fireEvent.click(screen.queryAllByText("Delete Question")[0]);

  // Wait for the element to be removed from the DOM
  await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));

  // Re-render to ensure state consistency if needed, though often not strictly necessary
  // after waitForElementToBeRemoved for a simple delete.
  rerender(<App />);

  // Wait for the remaining element to be present after re-render
  await screen.findByText(/lorem testum 2/g);

  // Assert that the deleted element is no longer in the document
  expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 2/g);

  // Await the change event that triggers a fetch and state update
  await fireEvent.change(screen.queryAllByLabelText(/Correct Answer/)[0], {
    target: { value: "3" },
  });

  // Assert the value immediately after the change and update
  expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");

  // Re-render to ensure state consistency if needed
  rerender(<App />);

  // Re-assert the value after re-render to confirm persistence
  expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
});
