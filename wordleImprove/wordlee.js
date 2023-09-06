class Player {
  #guessed;
  #maxChances;
  #usedChances;
  #guessedStatus;

  constructor(maxChances) {
    this.#maxChances = maxChances;
    this.#guessed = [];
    this.#usedChances = 0;
    this.#guessedStatus = false;
  }

  guesses(guessWord) {
    this.#guessed.push(guessWord);
    this.#usedChances += 1;
  }

  get guessed() {
    return [...this.#guessed];
  }

  get usedChances() {
    return this.#usedChances;
  }

  get guessStatus() {
    return this.#guessedStatus;
  }

  get chancesExhausted() {
    return this.#usedChances === this.#maxChances;
  }

  guessedCorrect() {
    this.#guessedStatus = true;
  }
}

class Wordle {
  #word;
  #player;
  #matchedLetters;

  constructor(word, player) {
    this.#player = player;
    this.#word = word;
    this.#matchedLetters = [];
  }

  get guesses() {
    const lettersMatched = [...this.#matchedLetters];
    this.#matchedLetters = [];
    return {
      guesses: [...this.#player.guessed],
      guessedLetters: lettersMatched
    };
  }

  #numberOfMatchedLetters(guessWord) {
    const lettersToMatch = [...this.#word];

    [...guessWord].forEach((letter, index) => {
      if (lettersToMatch.includes(letter)) {
        const letterIndex = lettersToMatch.indexOf(letter);

        this.#matchedLetters.push({ letter, index });
        lettersToMatch.splice(letterIndex, 1);
      }
    });
  }

  match(guess) {
    this.#player.guesses(guess);
    if (this.#word === guess) {
      this.#player.guessedCorrect();
    }
    this.#numberOfMatchedLetters(guess);
  }

  get guessStatus() {
    return this.#player.guessStatus;
  }

  get chancesExhausted() {
    return this.#player.chancesExhausted;
  }

  get word() {
    return this.#word;
  }
}

class View {
  constructor() { }

  #viewLettersMatchAndPos({ boxNumStart, guessedLetters, correctWord }) {
    guessedLetters.forEach(guessedLetter => {
      const atCorrectPosition = guessedLetter.letter === correctWord[guessedLetter.index];

      if (atCorrectPosition) {
        const boxNum = boxNumStart + guessedLetter.index;
        const letterBox = document.querySelector(`#box-${boxNum}`);
        letterBox.style.backgroundColor = "#77c577";
        return;
      }

      const boxNum = boxNumStart + guessedLetter.index;
      const letterBox = document.querySelector(`#box-${boxNum}`);
      letterBox.style.backgroundColor = "#e9ae17";
    });
  }

  #viewLetters({ guessNum, boxNumStart, guesses }) {
    [...guesses[guessNum]].forEach((letter) => {
      const letterBox = document.querySelector(`#box-${boxNumStart}`);
      letterBox.innerText = letter;
      boxNumStart += 1;
    });
  }

  renderElements({ guesses, guessedLetters }, correctWord) {
    const boxNumStart = (guesses.length - 1) * 5 + 1;
    let guessNum = guesses.length - 1;
    let guessedWord = guesses[1];

    this.#viewLettersMatchAndPos({
      boxNumStart,
      guessedLetters,
      guessedWord,
      correctWord
    });

    this.#viewLetters({ guessNum, boxNumStart, guesses });
  }
}

class WordleController {
  #wordle;
  #renderer;

  constructor(wordle, renderer) {
    this.#wordle = wordle;
    this.#renderer = renderer;
  }

  matchPlayerGuess(playerGuess) {
    if (playerGuess.length !== 5) {
      alert("Entered word is not of length 5");
      return;
    }
    if (this.#wordle.chancesExhausted) {
      alert("you are out of chances");
      return;
    }

    if (this.#wordle.guessStatus) {
      alert("You already guessed it right");
      return;
    }

    this.#wordle.match(playerGuess);
    this.#renderer.renderElements(this.#wordle.guesses, this.#wordle.word);
  }
}

const main = () => {
  const myWord = "smart";
  const maxChances = document.querySelectorAll(".guess-row").length;
  const player = new Player(maxChances);
  const wordle = new Wordle(myWord, player);
  const view = new View();
  const wordleController = new WordleController(wordle, view);

  const submitButton = document.querySelector("#submit");
  submitButton.onclick = () => {
    const guessBox = document.querySelector("#user-input");
    const playerGuess = guessBox.value;
    guessBox.value = "";

    wordleController.matchPlayerGuess(playerGuess);
  };
};

window.onload = main;