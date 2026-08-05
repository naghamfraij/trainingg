var symbols = ["🍎", "🐶", "🌟", "🚗", "🍕", "🎈", "🐱", "⚽"];

var board = document.getElementById("game-board");
var message = document.getElementById("message");

var firstCard = null;
var secondCard = null;
var canClick = true;
var matchedPairs = 0;

function shuffle(arr) {
  // copied from stackoverflow lol
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function createBoard() {
  var cards = shuffle(symbols.concat(symbols));

  board.innerHTML = "";
  message.textContent = "";
  firstCard = null;
  secondCard = null;
  canClick = true;
  matchedPairs = 0;

  for (var i = 0; i < cards.length; i++) {
    var card = document.createElement("div");
    card.className = "card";
    card.innerText = "?";
    card.setAttribute("data-symbol", cards[i]);
    card.onclick = flipCard;
    board.appendChild(card);
  }
}

function flipCard() {
  if (!canClick) return;
  if (this == firstCard) return;
  if (this.classList.contains("matched")) return;

  this.innerText = this.getAttribute("data-symbol");
  this.classList.add("flipped");

  if (firstCard == null) {
    firstCard = this;
  } else {
    secondCard = this;
    canClick = false;
    checkMatch();
  }
}

function checkMatch() {
  var sym1 = firstCard.getAttribute("data-symbol");
  var sym2 = secondCard.getAttribute("data-symbol");

  if (sym1 === sym2) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    matchedPairs++;
    firstCard = null;
    secondCard = null;
    canClick = true;

    if (matchedPairs === symbols.length) {
      message.textContent = "🎉 You won! Great job!";
    }
  } else {
    // wait a sec then flip back
    setTimeout(function() {
      firstCard.innerText = "?";
      secondCard.innerText = "?";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      canClick = true;
    }, 1000);
  }
}

createBoard();
