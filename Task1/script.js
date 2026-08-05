var currentPlayer = "X";
var gameOver = false;
var board = ["", "", "", "", "", "", "", "", ""];
var status = document.getElementById("status");
var boardElement = document.getElementById("board");
for (var i = 0; i < 9; i++) {
  var cell = document.createElement("div");
  cell.className = "cell";
  cell.dataset.index = i;
  cell.onclick = function () {
    handleClick(this, Number(this.dataset.index));
  };
  boardElement.appendChild(cell);
}
var winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleClick(cell, index) {
  if (gameOver) return;
  if (board[index] != "") return;  

  board[index] = currentPlayer;
  cell.innerText = currentPlayer;

  if (currentPlayer == "X") {
    cell.style.color = "#e63946";
  } else {
    cell.style.color = "#457b9d";
  }

  var winner = checkWinner();

  if (winner) {
    status.innerText = "Player " + winner + " wins! 🎉";
    gameOver = true;
    highlightWinner();
  } else if (!board.includes("")) {
   
    status.innerText = "It's a draw!";
    gameOver = true;
  } else {

    if (currentPlayer == "X") {
      currentPlayer = "O";
    } else {
      currentPlayer = "X";
    }
    status.innerText = "Player " + currentPlayer + "'s turn";
  }
}

function checkWinner() {
  for (var i = 0; i < winCombos.length; i++) {
    var a = winCombos[i][0];
    var b = winCombos[i][1];
    var c = winCombos[i][2];

    if (board[a] != "" && board[a] == board[b] && board[b] == board[c]) {
      return board[a];
    }
  }
  return null;
}


function highlightWinner() {
  for (var i = 0; i < winCombos.length; i++) {
    var a = winCombos[i][0];
    var b = winCombos[i][1];
    var c = winCombos[i][2];

    if (board[a] != "" && board[a] == board[b] && board[b] == board[c]) {
      var cells = document.querySelectorAll(".cell");
      cells[a].style.background = "#d8f3dc";
      cells[b].style.background = "#d8f3dc";
      cells[c].style.background = "#d8f3dc";
      break;
    }
  }
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameOver = false;
  status.innerText = "Player X's turn";

  var cells = document.querySelectorAll(".cell");
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.background = "";
    cells[i].style.color = "";
  }
}
