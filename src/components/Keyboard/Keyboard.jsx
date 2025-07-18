import './Keyboard.css';

const letters = "abcdefghijklmnopqrstuvwxyz";

const KeyBoard = ({
  activeLetter,
  inactiveLetters,
  addGuessedLetter,
  isDisabled,
}) => {
  return (
    <>
      <div className="keyboard">
        {letters.split("").map((letter) => {
          const isActive = activeLetter.includes(letter);
          const isInActive = inactiveLetters.includes(letter);
          return (
            <button
              onClick={() => addGuessedLetter(letter)}
              className={`btn ${isActive ? 'active' : ""} ${
                isInActive ? 'inactive' : ""
              }`}
              disabled={isActive || isInActive || isDisabled}
              key={letter}
            >
              <div>{letter}</div>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default KeyBoard;
