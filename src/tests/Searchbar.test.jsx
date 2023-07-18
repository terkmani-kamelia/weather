/* eslint-disable testing-library/no-node-access */
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  test("renders search bar correctly", () => {
    render(<SearchBar setSelectedCity={() => {}} />);

    // Check if the title is rendered
    expect(screen.getByText("Selectionner votre ville")).toBeInTheDocument();

    // Check if the input field is rendered
    const inputElement = screen.getByPlaceholderText("Rechercher une ville");
    expect(inputElement).toBeInTheDocument();

    // Check if the suggestions list is initially empty
    const suggestionsList = screen.getByRole("list");
    expect(suggestionsList.children.length).toBe(0);
  });

  test("updates search query on input change", () => {
    render(<SearchBar setSelectedCity={() => {}} />);

    const inputElement = screen.getByPlaceholderText("Rechercher une ville");

    fireEvent.change(inputElement, { target: { value: "Paris" } });

    expect(inputElement.value).toBe("Paris");
  });
});
