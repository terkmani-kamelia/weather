import React from "react";
import "./App.css";
import { useState } from "react";
import Weather from "./components/Weather";
import SearchBar from "./components/SearchBar";
import "./css/weather.css";
interface City {
  id: number;
  nm: string;
  lat: number;
  lon: number;
}
function App() {
  const [selectedCity, setSelectedCity] = useState<City | undefined>(undefined);
  return (
    <div className="App">
      <div className="container">
        <div className="search-container">
          <SearchBar setSelectedCity={setSelectedCity} />
          <Weather selectedCity={selectedCity} />
        </div>
      </div>
    </div>
  );
}

export default App;
