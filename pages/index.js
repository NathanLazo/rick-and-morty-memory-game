import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import Modal from "../components/Modal";

export async function getServerSideProps() {
  let characters = [];

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  const howManyPairs = 6;
  for (let count = 1; howManyPairs >= count; count++) {
    const id = getRandomInt(1, 826);
    const resp = await axios.get(
      `https://rickandmortyapi.com/api/character/${id}`
    );
    characters.push(resp.data);
  }

  //Logic for random cards
  let characterPairs = [];
  let randomPairs = [];

  //Actual random characters for rendering the pairs
  let randomCharacters = [];

  //Makes an array of numbers with how many pairs come from the server
  if (characterPairs.length === 0) {
    for (let count = 0; howManyPairs > count; count++) {
      characterPairs.push(count);
    }
  }

  /* 
      2 Loops to make the pairs
      1st loop takes a random number from the array of numbers (characterPairs)
      then adds it to the randomPairs array
      last it removes the number from the characterPairs array
      2nd loop takes the characters from the server and adds them to the randomCharacters array
      in a random way using the randomPairs array
    */
  const chooseRandomPair = () => {
    do {
      const randomNum = getRandomInt(0, characterPairs.length - 1);
      randomPairs.push(characterPairs[randomNum]);
      characterPairs.splice(randomNum, 1);
    } while (characterPairs.length > 0);
    for (let count = 0; count < randomPairs.length; count++) {
      randomCharacters.push(characters[randomPairs[count]]);
    }
  };

  if (randomCharacters.length === 0) {
    chooseRandomPair();
  }

  return {
    props: {
      characters,
      howManyPairs,
      randomCharacters,
    },
  };
}





const MemoryGame = ({ characters, howManyPairs, randomCharacters }) => {
  const [selectedPair, setSelectedPair] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [renderedImagesArray, setRenderedImagesArray] = useState([]);

  const manageSelectedPair = (e) => {
    e.preventDefault();
    const id = e.target.id;

    selectedPair.push(id);
    document.getElementById("button-" + id).classList.add("selected-card");
    if (selectedPair.length >= 2) {
      setSelectedPair([]);
    }
    if (selectedPair.length === 2) {
      if (
        selectedPair[0] == selectedPair[1] + "-pair" ||
        selectedPair[1] == selectedPair[0] + "-pair"
      ) {
        setMatchedPairs([...matchedPairs, ...selectedPair]);
      }
    }
    console.log(
      "🚀 ~ file: index.js ~ line 80 ~ manageSelectedPair ~ selectedPair",
      selectedPair
    );
    console.log("🚀 ~ file: index.js ~ line 95 ~ manageSelectedPair ~ matchedPairs", matchedPairs)

    
  };

  useEffect(() => {
    if (renderedImagesArray.length >= 2) {
      setTimeout(() => {
        setRenderedImagesArray([]);
      }, 750);
    }
  }, [renderedImagesArray]);


  return (
    <>
      <Head>
        <title>Rick and morty game</title>
        <meta name="description" content="Memory mini game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center w-full">
        <Image
          src="/images/rick-and-morty-logo.png"
          alt="Rick and morty logo"
          width={250}
          height={100}
        />
      </div>
      <div className="absolute bottom-0 left-0 text-indigo-800">
        Nathan was here
      </div>
      {
        matchedPairs.length === howManyPairs * 2 ? (
          <Modal />
        ) : null
      }
      <div className="flex justify-center mt-6 mx-6 xl:mx-0">
        {characters.length >= howManyPairs && (
          <div className="grid grid-rows-4 lg:grid-rows-3 gap-8 grid-flow-col ">
            {characters?.map((character) => (
              <button
                key={character.id}
                id={"button-" + character.id}
                className="col-span-1 border border-cyan-200 rounded-3xl h-auto flex flex-col divide-y divide-gray-200 bg-transparent text-center shadow 
                hover:ring-4 hover:ring-offset-2 hover:ring-cyan-400 hover:scale-105 hover:transition hover:ease-in-out hover:delay-75
                focus:ring-8 focus:ring-offset-2 focus:ring-cyan-400"
                onClick={manageSelectedPair}
              >
                <motion.div
                  initial={{opacity: 0}}
                  animate={
                    renderedImagesArray.includes(character.id) || matchedPairs.includes(character.id + "")
                      ? { opacity: 1 }
                      : {opacity: 0}
                  }
                  transition={{ duration: .6 }}
                  onClick={() => {setRenderedImagesArray([...renderedImagesArray,character.id])}}
                >
                  <img
                    className="relative mx-auto w-28 lg:w-36 flex-shrink-0 rounded-3xl"
                    src={character.image}
                    alt=""
                    id={character.id}
                  />
                </motion.div>
              </button>
            ))}
            {randomCharacters?.map((character) => (
              <button
                key={character.id}
                id={"button-" + character.id + "-pair"}
                className="col-span-1 border border-cyan-200 rounded-3xl h-auto flex flex-col divide-y divide-gray-200 bg-transparent text-center shadow 
                hover:ring-4 hover:ring-offset-2 hover:ring-cyan-400 hover:scale-105 hover:transition hover:ease-in-out hover:delay-75
                focus:ring-8 focus:ring-offset-2 focus:ring-cyan-400"
                onClick={manageSelectedPair}
              >
                <motion.div
                  initial={{opacity: 0}}
                  animate={
                    renderedImagesArray.includes(character.id + "-pair") || matchedPairs.includes(character.id + "-pair")
                      ? { opacity: 1 }
                      : {opacity: 0}
                  }
                  transition={{ duration: .6 }}
                  onClick={() => {setRenderedImagesArray([...renderedImagesArray,character.id + "-pair"])}}
                >
                  <img
                    className="relative mx-auto w-28 lg:w-36 flex-shrink-0 rounded-3xl"
                    src={character.image}
                    alt=""
                    id={character.id+ "-pair"}
                  />
                </motion.div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default MemoryGame;
