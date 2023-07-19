/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";

import "../css/weather.css";
import "../css/weathericons.css";
interface WeatherDay {
  day: string;
  weatherIcon: string;
  minTemp: number;
  maxTemp: number;
}

export default function Weather(props: any) {
  // States for today weather
  const [weatherIcon, setWeatherIcon] = useState<string>("");
  const [temperature, setTemperature] = useState<number>();
  const [description, setDescription] = useState<string>("");
  const [maxTemperature, setMaxTemperature] = useState<number>();
  const [minTemperature, setMinTemperature] = useState<number>();
  //States for nextDays
  const [nextDaysParameters, setNextDaysParameters] = useState<WeatherDay[]>(
    []
  );
  useEffect(() => {
    // Fetch current weather data for the selected city
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${props.selectedCity?.lat}&lon=${props.selectedCity?.lon}&appid=f4f40e860cf8390420eebb6930922d32`
    )
      .then(async (response) => {
        let data = await response.json();

        // Set description and weather icon based on weather data
        data.weather.map((weather: any) => {
          setDescription(weather?.description);
          let weatherIconClass: any = "wi wi-icon-default"; // Default class for the weather icon
          if (weather?.main === "Clear") {
            weatherIconClass = "wi wi-icon-800"; // Class for sunny weather icon
          } else if (weather?.main === "Rain") {
            weatherIconClass = "wi wi-icon-600"; // Class for rainy weather icon
          } else {
            weatherIconClass = "wi wi-icon-801"; // Default class for cloudy weather icon
          }
          setWeatherIcon(weatherIconClass);
        });

        // Set temperature data
        let celsiusTemp: any = (data.main.temp - 273.15).toFixed(0);
        setTemperature(celsiusTemp);
        let celsiusTempManx: any = (data.main.temp_max - 273.15).toFixed(0);
        setMaxTemperature(celsiusTempManx);
        let celsiusTempMin: any = (data.main.temp_min - 273.15).toFixed(0);
        setMinTemperature(celsiusTempMin);

        // Fetch forecast data for the selected city
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${props.selectedCity?.lat}&lon=${props.selectedCity?.lon}&appid=f4f40e860cf8390420eebb6930922d32`
        )
          .then(async (response) => {
            let forecastData = await response.json();

            // Initialize WeatherDay objects for the next three days
            let days = [
              {
                day: "",
                weatherIcon: "",
                minTemp: 100,
                maxTemp: -100,
              },
              {
                day: "",
                weatherIcon: "",
                minTemp: 100,
                maxTemp: -100,
              },
              {
                day: "",
                weatherIcon: "",
                minTemp: 100,
                maxTemp: -100,
              },
            ];

            const weekDays = [
              "dimanche",
              "lundi",
              "mardi",
              "mercredi",
              "jeudi",
              "vendredi",
              "samedi",
            ];
            // Process forecast data
            forecastData.list.map((forecast: any) => {
              const dateFromDtTxt: Date = new Date(forecast?.dt_txt);
              const dateActuelle: Date = new Date(); // Current date

              // Reset hours, minutes, seconds, and milliseconds of both dates
              let hour = dateFromDtTxt.getHours();
              dateFromDtTxt.setHours(0, 0, 0, 0);
              dateActuelle.setHours(0, 0, 0, 0);

              // Calculate the difference in days between the two dates
              const differenceInDays: number = Math.round(
                (dateFromDtTxt.getTime() - dateActuelle.getTime()) /
                  (24 * 60 * 60 * 1000)
              );

              // Check difference in days
              if (differenceInDays > 0 && differenceInDays < 4) {
                days[differenceInDays - 1].day =
                  weekDays[dateFromDtTxt.getDay()];

                // Update max and min temperatures
                if (
                  days[differenceInDays - 1].maxTemp <
                  forecast?.main?.temp - 273.15
                ) {
                  days[differenceInDays - 1].maxTemp = Number(
                    (forecast?.main?.temp - 273.15).toFixed(0)
                  );
                }
                if (
                  days[differenceInDays - 1].minTemp >
                  forecast?.main?.temp - 273.15
                ) {
                  days[differenceInDays - 1].minTemp = Number(
                    (forecast?.main?.temp - 273.15).toFixed(0)
                  );
                }
                // Set weather icon for day 1 at 12 PM
                if (hour === 12) {
                  forecast.weather.map((weather: any) => {
                    let weatherIconClass: any = "wi wi-icon-default"; // Default class for the weather icon
                    if (weather?.main === "Clear") {
                      weatherIconClass = "wi wi-icon-800"; // Class for sunny weather icon
                    } else if (weather?.main === "Rain") {
                      weatherIconClass = "wi wi-icon-600"; // Class for rainy weather icon
                    } else {
                      weatherIconClass = "wi wi-icon-801"; // Default class for cloudy weather icon
                    }
                    days[differenceInDays - 1].weatherIcon = weatherIconClass;
                  });
                }
              }
            });

            // Update the next days parameters state with the collected data
            setNextDaysParameters(days);
          })
          .catch((error) => {
            console.log(
              "An error occurred while loading the JSON file : ",
              error
            );
          });
      })
      .catch((error) => {
        console.log("An error occurred while loading the JSON file :", error);
      });
  }, [props.selectedCity]);

  return (
    <>
      {props.selectedCity === undefined && (
        <div className="my-loading-spinner" data-testid="my-loading-spinner">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {props.selectedCity !== undefined && (
        <div className="weather">
          <span className="selectedCity">{props.selectedCity.nm}</span>
          <span className={weatherIcon}></span>
          <span className="temperature">{temperature}°</span>
          <span className="description">{description}</span>
          <div className="maxMinTemperature">
            <span>max : {maxTemperature}°</span>
            <span>min : {minTemperature}°</span>
          </div>
          <div className="nextdays">
            {nextDaysParameters.map((next: WeatherDay) => {
              return (
                <span>
                  {next.day.charAt(0).toUpperCase() + next.day.slice(1)}
                </span>
              );
            })}
          </div>
          <div className="grid-container">
            {nextDaysParameters.map((next: WeatherDay) => {
              return (
                <div>
                  <span className={next.weatherIcon}></span>
                  <span>{next.minTemp}°</span>
                  <span className="temperaturemax">{next.maxTemp}°</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
