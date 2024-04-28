// Weather.js

import React, { useState, useEffect } from 'react';

const Weather = ({ cityId }) => {
  const [weather, setWeather] = useState('');

  useEffect(() => {
    const apiKey = '8a243859642ed29443c4156fda2a8fb5';
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&appid=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setWeather(`It's currently ${data.main.temp}°C in ${data.name}.`);
      })
      .catch(error => console.log(error));
  }, [cityId]); // useEffect will run when `cityId` changes

  return <div>{weather}</div>;
};

export default Weather;
