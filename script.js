let origBoard;
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];
let isHardMode = false;

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] === "number") {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer)) {
      if (!checkTie()) turn(bestSpot(), aiPlayer);
    }
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;

  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);

  let gameWon = null;

  for (const [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index, player };
      break;
    }
  }

  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player === huPlayer ? "blue" : "red";
  }
  document.querySelector(".endgame").style.backgroundColor =
    gameWon.player === huPlayer
      ? "rgba(54, 186, 209, 0.9)"
      : "rgba(209 ,54 ,54 , 0.9)";

  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }

  declareWinner(gameWon.player === huPlayer ? "You Won!" : "You Lost!");
}

function declareWinner(winner) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = winner;
}

function emptySquares() {
  return origBoard.filter((s) => typeof s === "number");
}

function bestSpot() {
  return !isHardMode ? emptySquares()[0] : minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length === 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
}

function minimax(newBoard, player) {
  const availableSpots = emptySquares(newBoard);

  if (checkWin(newBoard, player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 20 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availableSpots.length; i++) {
    const move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player === aiPlayer) {
      const result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function toggleHardMode() {
  isHardMode = !isHardMode;
  console.log(isHardMode);
}
