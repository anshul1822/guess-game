"use client"


import Image from "next/image";
import React from "react";
import axios from "axios";


export default function Home() {


  const [name, setName] = React.useState("");


  const [country, setCountries] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [age, setAge] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');


  const handleChange = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };


  React.useEffect(() => {
    let timeoutId;


    const fetchData = async () => {
      setLoading(true);
      setError('');


      try {
        //fetch country
        const countryResponse = await axios.get(
          `https://api.nationalize.io/?name=${name}`
        );


        const countries = countryResponse?.data?.country;
        const country = getMostProbableCountry(countries);
        setCountries(country);


        //fetch gender
        const genderResponse = await axios.get(
          `https://api.genderize.io/?name=${name}`
        );
        const gender = genderResponse.data?.gender;
        setGender(gender);


        //fetch age
        const ageResponse = await axios.get(
          `https://api.agify.io/?name=${name}`
        );
        const age = ageResponse.data?.age;
        setAge(age);
      } catch (error) {
        console.log("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };


    const debounceFetch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchData, 1000);
    };


    if (name) {
      debounceFetch();
    }


    return () => clearTimeout(timeoutId);
  }, [name]);


  const getMostProbableCountry = (countries) => {
    let maxProbablity = 0;
    let country = "";


    countries?.forEach((c) => {
      if (+country.probability > +maxProbablity) {
        maxProbablity = c.probability;
        country = c.country_id;
      }
    });


    return country;
  };


  return (
    <div className="bg-purple-900 text-white  h-screen w-full text-2xl py-4">
      <div className="text-6xl mb-5"> Let's Play a Game !! </div>
      <div className="flex justify-evenly items-center py-4 px-2">
        <div> Enter your name: </div>
        <input
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="Enter Name"
          className="p-2 text-black"
        />
      </div>
      <div className="result">
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {country && <div>Country: {country}</div>}
        {gender && <div>Gender: {gender}</div>}
        {age && <div>Age: {age}</div>}
      </div>
    </div>
  );


 
}
