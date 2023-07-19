import { render, screen } from "@testing-library/react";
import Weather from "../components/Weather";

describe("Weather", () => {
  test("renders loading spinner when selectedCity is undefined", () => {
    render(<Weather selectedCity={undefined} />);
    const loadingSpinner = screen.queryByTestId("my-loading-spinner");
    console.log(loadingSpinner);
    expect(loadingSpinner).toBeInTheDocument();
  });

  test("renders weather data when selectedCity is defined", async () => {
    const selectedCity = {
      id: 1,
      nm: "Paris",
      lat: 48.8566,
      lon: 2.3522,
    };

    render(<Weather selectedCity={selectedCity} />);

    // Check if selectedCity is correct
    expect(screen.getByText("Paris")).toBeInTheDocument();
  });
});
