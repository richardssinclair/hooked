import "./Hooked.css";
import KeyBoard from "./components/Keyboard/Keyboard";

import { useCallback, useEffect, useState } from "react";

import { songs } from './songs';

const getModifiedSentence = (sentence) => {
  const cleanedSentence = sentence.replace(/[^\w\s]/g, "").toLowerCase();
  const words = cleanedSentence.split(" ");
  const wordToRemoveIndex = words.findIndex((word) => word.length >= 4);

  if (wordToRemoveIndex !== -1) {
    const missingWord = words[wordToRemoveIndex];
    words[wordToRemoveIndex] = missingWord
      .split("")
      .map(() => "_")
      .join("");

    return { sentence: words.join(" "), missingWord };
  }

  return { sentence: cleanedSentence, missingWord: "" };
};

const Hooked = () => {
  const [elevatorSounds, setElevatorSounds] = useState(null);
  const [nopeSound, setNopeSound] = useState(null);
  const [winningSound, setWinningSound] = useState(null);

  const [sentenceData, setSentenceData] = useState({
    sentence: "",
    missingWord: "",
  });

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [prevGuessesLeft, setPrevGuessesLeft] = useState(7);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setElevatorSounds(new Audio('./ElevatorMusicCopy.wav'));
    setNopeSound(new Audio('./Nope.wav'));
    setWinningSound(new Audio('./crowdcheer.wav'));
  }, []);

  useEffect(() => {
    const selectedSentence = songs[Math.floor(Math.random() * songs.length)];
    setSentenceData(getModifiedSentence(selectedSentence));
  }, []);

  const incorrectLetters = guessedLetters.filter(
    (letter) => !sentenceData.missingWord.includes(letter)
  );

  const isLooser = incorrectLetters.length >= 7;

  const maxGuesses = 7;

  const guessesLeft = maxGuesses - incorrectLetters.length;

  useEffect(() => {
    if (guessesLeft < prevGuessesLeft) {
      if (isMuted) return;

      nopeSound?.play();
    }
    setPrevGuessesLeft(guessesLeft);
  }, [guessesLeft]);

  // added to use music
  const isWinner = sentenceData.missingWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const onReload = () => {
    const selectedSentence = songs[Math.floor(Math.random() * songs.length)];
    setSentenceData(getModifiedSentence(selectedSentence));
    setGuessedLetters([]);
  };

  const muteToggle = () => {
    setIsMuted((prevMuted) => {
      const newMutedState = !prevMuted;

      if (newMutedState) {
        elevatorSounds.pause();
      } else {
        elevatorSounds.play();
      }

      return newMutedState;
    });
  };

  const addGuessedLetters = useCallback(
    (letter) => {
      // if our letter is already guessed just return
      if (guessedLetters.includes(letter)) return;

      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters]
  );

  useEffect(() => {
    const handler = (e) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetters(key);
    };
    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);

  if (isWinner && !isMuted) {
    winningSound?.play();
  };

  return (
    <>
      <div>
        <h3 className={`title`}>
          Hooked
        </h3>
        <h3 className={`subtitle ${isWinner && 'winnerColour'}`}>
          {isWinner
            ? "Winner!!!"
            : isLooser
            ? "Looser!!!"
            : `Guesses left: ${7 - incorrectLetters.length}`}
        </h3>
        <div className="gifBox">
          <img className="gifImg" src="./giphy2.gif" alt="" />
          {(isWinner || isLooser) && (
            <img
              className="gifImgResult"
              src={(isWinner && "./giphy5.gif") || (isLooser && "./giphy1.gif")}
              alt=""
            />
          )}
        </div>
      </div>
      <div className="game-container">
        <div className="game-controls">
          <div className="lyrics-box">
            <p className="lyrics-text">
              {sentenceData.sentence.split(" ").map((word, index) => {
                if (word.includes("_")) {
                  return (
                    <span key={index} style={{ marginRight: "5px" }}>
                      {sentenceData.missingWord
                        .split("")
                        .map((letter) =>
                          guessedLetters.includes(letter) ? letter : " _ "
                        )}
                    </span>
                  );
                }
                return (
                  <span key={index} style={{ marginRight: "5px" }}>
                    {word}{" "}
                  </span>
                );
              })}
            </p>
          </div>
          <div>
            <KeyBoard
              isDisabled={isWinner || isLooser}
              activeLetter={guessedLetters.filter(
                (letter) => sentenceData.missingWord.includes(letter)
              )}
              inactiveLetters={incorrectLetters}
              addGuessedLetter={addGuessedLetters}
            />
            <button
              className='button'
              onClick={onReload}
            >
              Reset
            </button>
            <button
              className='button'
              onClick={muteToggle}
            >
              {!isMuted ? "mute" : "unmute"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hooked;
