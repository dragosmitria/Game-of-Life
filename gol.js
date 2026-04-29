let game_board = document.getElementById("game_board");
let time_slider = document.getElementById("time_slider");

function drawCells(board, rows, cols) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.style.width = `${100 / cols}%`;
      if (board[i][j] == 1) {
        cell.style.backgroundColor = "darkgreen";
      }
      game_board.appendChild(cell);
    }
  }
}

function updateCells(board, rows, cols) {
  let cell = game_board.firstChild;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] == 1) cell.style.backgroundColor = "darkgreen";
      else cell.style.backgroundColor = "rgb(164, 219, 121)";
      cell = cell.nextSibling;
    }
  }
}

function removeCells() {
  while (game_board.firstChild) {
    game_board.removeChild(game_board.lastChild);
  }
}

document.getElementById("start").addEventListener("click", (e) => {
  e.target.disabled = true;
  document.getElementById("reset").disabled = false;
  startGame(seed);
});

document.getElementById("reset").addEventListener("click", async (e) => {
  e.target.disabled = true;
  should_reset = 1;
  seed = createSeed(mat, rows, cols);
  removeCells();
  // document.getElementById("iterations").innerHTML = `Iteratii: 0`;
  drawCells(seed, rows, cols);
  document.getElementById("start").disabled = false;
})

let should_reset = 0;
let cols = 100;
let rows = Math.floor(cols * (15 / 40));



// Game logic --------------------------------------------
async function startGame(seed) {
  let nr_iter = 0;
  console.log("Start game");

  let board1 = seed;
  let board2 = createMatrix(rows, cols);

  while (!should_reset) {
    board2 = getNextBoard(board1, rows, cols);
    updateCells(board1, rows, cols);
    // nr_iter++;
    // document.getElementById("iterations").innerHTML = `Iteratii: ${nr_iter}`;
    await delay();
    if(should_reset)
    break;
    board1 = getNextBoard(board2, rows, cols);
    updateCells(board2, rows, cols);
    // nr_iter++;
    // document.getElementById("iterations").innerHTML = `Iteratii: ${nr_iter}`;
    await delay();
  }
  should_reset = 0;
}

function delay() {
  let time = document.getElementById("time_slider").value;
  // console.log("TIMPUL SELECTAT: " + time);
  return new Promise((resolve) => setTimeout(resolve, time*10));
}

function getNextBoard(board, rows, cols) {
  let next_board = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let neighb_count = calcNeighbors(board, i, j);
      if (neighb_count > 3) next_board[i][j] = 0;
      if (neighb_count < 2) next_board[i][j] = 0;
      if (neighb_count == 3) next_board[i][j] = 1;
      if (neighb_count == 2) next_board[i][j] = board[i][j];
    }
  }
  return next_board;
}

function calcNeighbors(board, x, y) {
  let sum = 0;
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (!(i < 0 || i == rows || j < 0 || j == cols)) {
        sum += board[i][j];
      }
    }
  }
  // console.log(`Sum for [${x}][${y}] is ${sum}`);
  return sum - board[x][y];
}

function createMatrix(rows, cols) {
  let board = new Array(rows);
  for (let i = 0; i < rows; i++) board[i] = new Array(cols);
  return board;
}

function createSeed(board, rows, cols) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      board[i][j] = Math.floor(Math.random() * 2);
    }
  }
  return board;
}

mat = createMatrix(rows, cols);
seed = createSeed(mat, rows, cols);
drawCells(seed, rows, cols);
