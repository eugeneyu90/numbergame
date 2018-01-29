// REQUIREMENTS ********************************************************************
// The game must ask the player for their name and log out a welcome message
// The game must call the startGame function exactly once
// You must define and use the functions laid out in Step 5
// The game must accept the upper limit for random numbers from the user
// If the user enters 10, the game must select a number from the range 0 <= n <= 10
// If the user enters 0, you should exit the game
// The game must give the user some direction on how to achieve a correct answer
// If their guess is too low, the game should print "Too low!"
// If their guess is too low, the game should print "Too high!"
// The game must end when the user enters a correct guess
// The game must continue if the user enters an incorrect guess
// You must correctly parse all user inputs to their correct types

// INITIALIZED GLOBAL VARIABLES START***********************************************
let playerList = [];
let currentPlayer = "";
let currentGame = new Game();
let displayMin = 0;
let displayMax = 0;
let input = null;
const difficultyLevels = {
  custom: 0,
  easy: 10,
  medium: 8,
  hard: 5
};
const states = {
  0: "nameInput",
  1: "nameInput",
  2: "difficultyInput",
  3: "difficultyInput",
  4: "maxInput",
  5: "guessInput",
  6: "guessInput",
  7: "guessInput",
  8: "maxGuessInput"
};
let currentState = 0;

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});

// GLOBAL INITIALIZED VARIABLES END***********************************************

// CONSTRUCTORS - START
function Guess(value, diff) {
  this.value = value;
  this.diff = diff;
}

function Game(difficulty, maxGuesses, max, goal, status, guesses, diffs) {
  this.difficulty = difficulty;
  this.maxGuesses = maxGuesses;
  this.max = max;
  this.goal = goal;
  this.status = status;
  this.guesses = [];
  this.diffs = [];
}

function Score(player, guesses, max) {
  this.player = player;
  this.guesses = guesses;
  this.max = max;
}
// CONSTRUCTORS - END

function generateRandomNumber(max) {
  // generate a random integer between 0 and max
  return Math.floor(Math.random() * max);
}

function isGuessCorrect(goal, guess) {
  // check if a guess is correct and return a boolean
  if (guess === goal) return true;
  else return false;
}

function getDiff(guess, goal) {
  let diff = goal - guess; //4 = 7 - 3 --> Too Low // -1 = 7 - 8 --> Too High
  if (diff < 0) return "Over";
  else if (diff > 0) return "Under";
  else return "Correct";
}

function waitForInput(event) {
  let id = "#" + states[currentState];
  if (event.keyCode === 13) {
    input = $(id).val();
    switch (currentState) {
      case 1:
        getNameFromUser(input);
        break;
      case 2:
        getDifficultyFromUser(input);
        break;
      case 3:
        getDifficultyFromUser(input);
        break;
      case 4:
        getMaxFromUser(input);
        break;
      case 5:
        getGuessFromUser(input);
        break;
      case 8:
        getMaxGuessesFromUser(input);
      default:
        break;
    }
  }
}

var changeMessage = () => {
  var messages = {
    0: "Currently in the menu page...", // not shown...
    1: "Enter your name: ",
    2: "Nice to meet you, " + currentPlayer + "! <br>Select a game difficulty: ",
    3: "Welcome back " + currentPlayer + "! <br>Select a game difficulty: ",
    4: "Enter a number for the max limit or 0 to quit: ",
    5: "Take a guess between 0 and " + currentGame.max + ".",
    6: "You Won! You took " + currentGame.guesses.length + " guess(es)!<br> Would you like to play again?",
    7: "You Lost! You ran out of guesses!<br>Would you like to play again?",
    8: "Enter a number for the maximum number of guesses allowed: "
  };
  $("#message").html(messages[currentState]);
  $("#messageError").hide();
};

var addError = errorMessage => {
  $("#messageError").html(errorMessage);
  $("#messageError").show();
  $("#" + states[currentState]).val("");
};

var changeState = num => {
  $("#" + states[currentState]).val("");
  $("#" + states[currentState]).attr("id", states[num]);
  currentState = num;
  // console.log("currentState is now " + currentState);
};

var getNameFromUser = input => {
  currentPlayer = input;
  if (playerList[currentPlayer] == undefined) {
    playerList[currentPlayer] = [];
    changeState(2);
    changeMessage();
  } else {
    changeState(3);
    changeMessage();
  }
  $("#playerName").html("Player: " + currentPlayer);
  $("#playerName").show();
  showDifficulties();
};

var customMode = () => {
  changeState(8);
  changeMessage();
  currentGame = new Game();
  currentGame.difficulty = "custom";
  currentGame.maxGuesses = difficultyLevels["custom"];
  hideDifficulties();
  $("#" + states[currentState]).show();
  $("#" + states[currentState]).focus();
};

var easyMode = () => {
  currentGame = new Game();
  currentGame.difficulty = "easy";
  currentGame.maxGuesses = difficultyLevels["easy"];
  currentGame.max = "20";
  currentGame.goal = generateRandomNumber(currentGame.max);
  changeState(5);
  changeMessage();
  displayGuessesLeft();
  $("#guessesLeft").show();
  hideDifficulties();
  $("#" + states[currentState]).show();
  $("#" + states[currentState]).focus();
  console.log("The max is " + currentGame.max);
  console.log("[Hint] The answer is " + currentGame.goal);
};

var mediumMode = () => {
  currentGame = new Game();
  currentGame.difficulty = "medium";
  currentGame.maxGuesses = difficultyLevels["medium"];
  currentGame.max = "30";
  currentGame.goal = generateRandomNumber(currentGame.max);
  changeState(5);
  changeMessage();
  displayGuessesLeft();
  $("#guessesLeft").show();
  hideDifficulties();
  $("#" + states[currentState]).show();
  $("#" + states[currentState]).focus();
  console.log("The max is " + currentGame.max);
  console.log("[Hint] The answer is " + currentGame.goal);
};

var hardMode = () => {
  currentGame = new Game();
  currentGame.difficulty = "hard";
  currentGame.maxGuesses = difficultyLevels["hard"];
  currentGame.max = "50";
  currentGame.goal = generateRandomNumber(currentGame.max);
  changeState(5);
  changeMessage();
  displayGuessesLeft();
  $("#guessesLeft").show();
  hideDifficulties();
  console.log("The max is " + currentGame.max);
  console.log("[Hint] The answer is " + currentGame.goal);
};

var getMaxGuessesFromUser = input => {
  let maxGuesses = input;
  if (isNaN(maxGuesses) || maxGuesses === "" || Number(maxGuesses) === 0) {
    addError("Enter a valid number. I can't accept " + maxGuesses + ".");
  } else {
    currentGame.maxGuesses = maxGuesses;
    changeState(4);
    changeMessage();
    displayGuessesLeft();
    $("#guessesLeft").show();
  }
};

var getMaxFromUser = input => {
  let max = input;
  if (isNaN(max) || max === "") {
    addError("Enter a number. I can't accept " + max + ".");
  } else if (max == 0) {
    showMenu();
  } else {
    if (Number(max) <= currentGame.maxGuesses) {
      addError("Enter a valid number over " + currentGame.maxGuesses + ".");
    } else {
      currentGame.max = max;
      currentGame.goal = generateRandomNumber(max);
      changeState(5);
      changeMessage();
      console.log("The max is " + currentGame.max);
      console.log("[Hint] The answer is " + currentGame.goal);
    }
  }
};
var getDisplayMin = () => {
  let index = currentGame.diffs.lastIndexOf("Under");
  if (index == -1) {
    return 0;
  } else {
    return Number(currentGame.guesses[index]) + 1;
  }
};

var getDisplayMax = () => {
  let index = currentGame.diffs.lastIndexOf("Over");
  if (index == -1) {
    return currentGame.max;
  } else {
    return Number(currentGame.guesses[index]) - 1;
  }
};

var getGuessFromUser = guess => {
  let min = Number(getDisplayMin());
  let max = Number(getDisplayMax());
  if (
    isNaN(guess) ||
    (Number(guess) < min || Number(guess) > max) ||
    guess === ""
  ) {
    addError("I cannot accept: " + guess + "!");
  } else {
    console.log("You have guessed " + guess + ".");
    currentGame.guesses.push(guess);
    currentGame.diffs.push(getDiff(Number(guess), currentGame.goal));
    displayGuessesLeft();
    min = Number(getDisplayMin());
    max = Number(getDisplayMax());
    let totalGuesses = currentGame.guesses.length;
    switch (currentGame.diffs[totalGuesses - 1]) {
      case "Over":
        addError("Too High!");
        if (currentGame.maxGuesses - totalGuesses === 0) {
          currentGame.status = "Lose";
          playerList[currentPlayer].push(currentGame);
          changeState(7);
          changeMessage();
          addError("Too High!");
          showPlayAgain();
        } else {
          $("#message").html(
            "Take another guess between " + min + " and " + max
          );
        }
        break;
      case "Under":
        addError("Too Low!");
        if (currentGame.maxGuesses - totalGuesses === 0) {
          currentGame.status = "Lose";
          playerList[currentPlayer].push(currentGame);
          changeState(7);
          changeMessage();
          addError("Too Low!");
          showPlayAgain();
        } else {
          $("#message").html(
            "Take another guess between " + min + " and " + max
          );
        }
        break;
      case "Correct":
        currentGame.status = "Win";
        playerList[currentPlayer].push(currentGame);
        changeState(6);
        changeMessage();
        showPlayAgain();
        showFireWorks();
        break;
      default:
        console.log(
          "error: dont know the diff: " +
            currentGame.guesses[currentGame.guesses.length - 1].diff
        );
    }
  }
};

var showFireWorks = () => {
  // CSS from https://codepen.io/yshlin/pen/ylDEk
  $("#fireworksContainer").addClass("pyro");
};

var removeFireWorks = () => {
  $("#fireworksContainer").removeClass("pyro");
};

var showDifficulties = () => {
  $("#messageBox").css("height", "125px");
  $("#userInputBar").hide();
  $("#difficultyButtonsContainer").show();
};

var hideDifficulties = () => {
  $("#messageBox").css("height", "250px");
  $("#difficultyButtonsContainer").hide();
  $("#userInputBar").show();
};

var showPlayAgain = () => {
  $("#userInputBar").hide();
  $("#userReplayButtons").show();
  $("#yesButton").focus();
};

var showScores = () => {
  printScores();
  $("#guessesLeftContainer").hide();
  $("#menuButtons").hide();
  $("#gameDisplay").hide();
  $("#playerScores").show();
};

var closeScoreBoard = () => {
  $("#playerScores").hide();
  $("#guessesLeftContainer").show();
  $("#menuButtons").show();
  $("#gameDisplay").show();
};

var displayGuessesLeft = () => {
  $("#guessesLeft").html(
    "Guesses Left: " + (currentGame.maxGuesses - currentGame.guesses.length)
  );
};

var replay = () => {
  $("#userReplayButtons").hide();
  $("#guessesLeft").hide();
  showDifficulties();
  changeState(3);
  changeMessage();
  removeFireWorks();
  $("#" + states[currentState]).focus();
};

var showMenu = () => {
  changeState(0);
  removeFireWorks();
  $("#guessesLeft").hide();
  $("#userReplayButtons").hide();
  $("#messageBox").hide();
  $("#userInputBar").hide();
  $("#guessesLeftContainer").show();
  $("#menuButtons").show();
  if (currentPlayer != null) {
    $("#playButton").show();
    $("#existingPlayerButton").show();
  }
};

var addPlayer = () => {
  changeState(1);
  changeMessage();
  $("#menuButtons").hide();
  $("#messageBox").show();
  $("#userInputBar").show();
  $("#nameInput").show();
  $("#nameInput").focus();
  $("#guessesLeftContainer").show();
};

var startGame = () => {
  changeState(3);
  changeMessage();
  $("#menuButtons").hide();
  $("#userReplayButtons").hide();
  $("#messageBox").show();
  showDifficulties();
  $("#" + states[currentState]).show();
  $("#" + states[currentState]).focus();
};


var printScores = () => {
  let easyArray = [];
  let mediumArray = [];
  let hardArray = [];

  for (var player in playerList) {
    if (playerList.hasOwnProperty(player)) {
      for (var game in playerList[player]) {
        if (playerList[player][game].status == "Win") {
          if (playerList[player][game].difficulty == "easy") {
            easyArray.push(
              new Score(
                player,
                playerList[player][game].guesses.length,
                playerList[player][game].max
              )
            );
          }
          if (playerList[player][game].difficulty == "medium") {
            mediumArray.push(
              new Score(
                player,
                playerList[player][game].guesses.length,
                playerList[player][game].max
              )
            );
          }
          if (playerList[player][game].difficulty == "hard") {
            hardArray.push(
              new Score(
                player,
                playerList[player][game].guesses.length,
                playerList[player][game].max
              )
            );
          }
        }
      }
    }
  }
  easyArray.sort(function(a, b) {
    return a.guesses - b.guesses;
  });
  mediumArray.sort(function(a, b) {
    return a.guesses - b.guesses;
  });
  hardArray.sort(function(a, b) {
    return a.guesses - b.guesses;
  });

  // Easy Scores
  if (easyArray.length == 0) {
    let easyHtmlOutput =
      '<span class="red-text text-center">You haven\'t won any games yet!</span>';
    $("#easyScores").html(easyHtmlOutput);
  } else {
    easyArray = easyArray.slice(0, 5);
    let easyHtmlOutput =
      '<thead><tr><th scope="col">Ranking</th><th scope="col">Name</th><th scope="col">Guesses</th><th scope="col">Max</th></tr></thead><tbody>';
    easyArray.forEach(function(rank, index) {
      easyHtmlOutput += "<tr>";
      easyHtmlOutput += "<td>" + (index + 1) + "</td>";
      easyHtmlOutput += "<td>" + rank.player + "</td>";
      easyHtmlOutput += "<td>" + rank.guesses + "</td>";
      easyHtmlOutput += "<td>" + rank.max + "</td>";
      easyHtmlOutput += "</tr>";
    });
    easyHtmlOutput += "<tbody>";
    $("#easyScores").html(easyHtmlOutput);
  }
  // Medium Scores
  if (mediumArray.length == 0) {
    let easyHtmlOutput =
      '<span class="red-text text-center">You haven\'t won any games yet!</span>';
    $("#mediumScores").html(easyHtmlOutput);
  } else {
    mediumArray = mediumArray.slice(0, 5);
    let mediumHtmlOutput =
      '<thead><tr><th scope="col">Ranking</th><th scope="col">Name</th><th scope="col">Guesses</th><th scope="col">Max</th></tr></thead><tbody>';
    mediumArray.forEach(function(rank, index) {
      mediumHtmlOutput += "<tr>";
      mediumHtmlOutput += "<td>" + (index + 1) + "</td>";
      mediumHtmlOutput += "<td>" + rank.player + "</td>";
      mediumHtmlOutput += "<td>" + rank.guesses + "</td>";
      mediumHtmlOutput += "<td>" + rank.max + "</td>";
      mediumHtmlOutput += "</tr>";
    });
    mediumHtmlOutput += "<tbody>";
    $("#mediumScores").html(mediumHtmlOutput);
  }
  // Hard Scores
  if (hardArray.length == 0) {
    let hardHtmlOutput =
      '<span class="red-text text-center">You haven\'t won any games yet!</span>';
    $("#hardScores").html(hardHtmlOutput);
  } else {
    hardArray = hardArray.slice(0, 5);
    let hardHtmlOutput =
      '<thead><tr><th scope="col">Ranking</th><th scope="col">Name</th><th scope="col">Guesses</th><th scope="col">Max</th></tr></thead><tbody>';
    hardArray.forEach(function(rank, index) {
      hardHtmlOutput += "<tr>";
      hardHtmlOutput += "<td>" + (index + 1) + "</td>";
      hardHtmlOutput += "<td>" + rank.player + "</td>";
      hardHtmlOutput += "<td>" + rank.guesses + "</td>";
      hardHtmlOutput += "<td>" + rank.max + "</td>";
      hardHtmlOutput += "</tr>";
    });
    hardHtmlOutput += "<tbody>";
    $("#hardScores").html(hardHtmlOutput);
  }
};
