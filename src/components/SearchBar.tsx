/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent } from "react";
import "../css/SearchBar.css";
import "../css/weathericons.css";

interface City {
  id: number;
  nm: string;
  lat: number;
  lon: number;
}
export default function SearchBar({ setSelectedCity }: any) {
  //-----------States for search bar-----------------------//
  // State for the search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  // State for the search suggestions
  const [suggestions, setSuggestions] = useState([]);

  // useEffect to update suggestions based on search query
  useEffect(() => {
    fetchSuggestions();
  }, [searchQuery]);

  // Function to fetch suggestions based on search query
  const fetchSuggestions = async () => {
    if (searchQuery.length > 0) {
      // Fetch the "cities-fr.json" file
      fetch("cities-fr.json")
        .then(async (response) => {
          let data = await response.json();
          // Filter the cities based on the search query
          const filteredCities = data.filter((city: City) =>
            city?.nm.toLowerCase().startsWith(searchQuery.toLowerCase())
          );
          // Set the filtered cities as suggestions
          setSuggestions(filteredCities);
        })
        .catch((error) => {
          // Handle the error if there is any
          console.log("An error occurred while loading the JSON file: ", error);
        });
    } else {
      // If the search query is empty, clear the suggestions
      setSuggestions([]);
    }
  };

  // Function to handle input change event
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Update the search query state with the new input value
    setSearchQuery(e.target.value);
  };

  // function to update selected city
  const handleSuggestionClick = (city: City) => {
    setSelectedCity(city);
    setSuggestions([]);
  };

  return (
    <>
      <span className="title">Selectionner votre ville</span>
      <div className="search">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Rechercher une ville"
          className="search-bar"
        />
        <ul className="suggestions">
          {suggestions.map((city: any, index) => (
            <li key={index} onClick={() => handleSuggestionClick(city)}>
              {city?.nm}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
