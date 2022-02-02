// Globals
var arrWordList = [];
var todaysWord = '';
var currGuess = 1;
var totalGuesses = 6
var victory = false;


function parseGuessWord(arrInputs) {
  let guessWord = '';
  for (let i = 0; i < arrInputs.length; i++) {
    guessWord += arrInputs[i].value;
  }
  return guessWord;
}


function validWord(word) {
  if(arrWordList.includes(word)) {
    return true;
  } else {
    return false;
  }
}


function shakeRow() {
  document.getElementById("guess" + currGuess).className = "";
  let arrInputs = document.getElementById("guess" + currGuess).getElementsByTagName("input");

  for (let i = 0; i < arrInputs.length; i++) {
    arrInputs[i].value = "";
    arrInputs[0].focus();
  }
}


function calculateScore(guessWord) {
  let score = ["⬛️", "⬛️", "⬛️", "⬛️", "⬛️"];
  let charsChecked = [];
  if (guessWord === todaysWord) {
    score = ["🟩", "🟩", "🟩", "🟩", "🟩"];
    victory = true;
  } else {
    // check for Greens
    for (let i = 0; i < 5; i++) {
      if (guessWord[i] === todaysWord[i]) {
        score[i] = "🟩";
        charsChecked[i] = true;
      }
    }
    
    // then for Yellows
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (i != j && score[i] === "⬛️" && !charsChecked[j] && guessWord[i] === todaysWord[j]) {
          score[i] = "🟨";
          charsChecked[j] = true;
        }
      }
    }
  }

  return score;
}


function submitGuess() {
  let arrInputs = document.getElementById("guess" + currGuess).getElementsByTagName("input");
  let guessWord = parseGuessWord(arrInputs);

  if (validWord(guessWord)) {
    console.log(currGuess);
    currGuess++;
    let result = calculateScore(guessWord);
    for (let i = 0; i < arrInputs.length; i++) {
      arrInputs[i].className += result[i];
    }
    if (victory) {
      document.getElementsByTagName("body")[0].className += "pyro";
    } else if (currGuess <= totalGuesses) {
      prepareRow(currGuess);
    } else {
      setTimeout(() => {alert("Too bad! Try again tomorrow")}, 1000);
    }
  } else {
    document.getElementById("guess" + currGuess).className = "shake";
    setTimeout(() => {shakeRow()}, 1000);
  }
}


function prepareRow(row) {
  // disable previous row
  if (row > 1) {
    const inputs = document.getElementById("guess" + (row - 1)).getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].setAttribute("disabled", true);
    }

    const buttons = document.getElementById("guess" + (row - 1)).getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("disabled", true);
    }
  }

  // enable next row
  const inputs = document.getElementById("guess"+row).getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].removeAttribute("disabled");
  }
  document.getElementById("guess"+row).getElementsByTagName("button")[0].removeAttribute("disabled");
  inputs[0].focus();
}


function dateSeed() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  return Number(yyyy+mm+dd);
}


function myRandom(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function init() {
  // set inputs to inactive and add event handler
  const inputs = document.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].setAttribute("disabled", true);
    inputs[i].addEventListener("keyup", function(event) {
      if (event.key === "Backspace" || event.key === "Delete") {
        this.value = '';
        if (this.previousElementSibling) {
          this.previousElementSibling.focus();
        }
      } else if (this.value.length > 0) {
        this.value = this.value.toUpperCase();
        this.nextElementSibling.focus();
      }
    });
  }

  //set buttons to inactive and add event handler
  const buttons = document.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].setAttribute("disabled", true);
    buttons[i].addEventListener("click", function() {
      submitGuess();
    })
  }
}


function getWordList() {
  // Load word list
  var client = new XMLHttpRequest();
  client.open('GET', './words.txt');
  client.onloadend = function() {
    arrWordList = client.responseText.toUpperCase().split(/\n/);

    // Pick todays word
    let random = Math.floor(myRandom(dateSeed()) * arrWordList.length);
    todaysWord = arrWordList[random];
    
    // Let the game begin
    init();
    prepareRow(1);
  }
  client.send()
}


window.onload = function() {
  getWordList();
}