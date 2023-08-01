const KontentManagement = window["kontentManagement"];

const managementClient = new KontentManagement.ManagementClient({
  environmentId: "df1e814e-fec9-02fe-94ef-9413761ffcad",
  // using CM API key in browser is NOT safe. If you need to use SDK in browsers
  // you should use proxy server and set authorization header there rather than here
  apiKey:
    "API key goes here",
});

// ??
async function updateKontentData() {
  const response = await managementClient
    .upsertLanguageVariant()
    .byItemCodename("game_1")
    .byLanguageCodename("default")
    .withData((builder) => {
      return {
        elements: [
          builder.textElement({
            element: { codename: "board" },
            value: JSON.stringify([]),
          }),
        ],
      };
    })
    .toPromise();
  return response;
  // const languages = await managementClient.listLanguages().toPromise()
  // return languages
}

// Retrieves game state
async function fetchKontentData() {
  // const response = await deliveryClient
  //   .item("game_1")
  //   .elementsParameter(["board", "current_player", "winner", "draw"])
  //   .toPromise();
  // return response.data.item.elements;
  const response = await managementClient
    .viewLanguageVariant()
    .byItemCodename("game_1")
    .byLanguageCodename("default")
    .toPromise();
  return response.data.elements;
}

// Define draw variable
let draw = false;

// Define winner variable
let winner = null;

// Define the Tic Tac Toe board as a string with 9 empty cells
let board = "         ";

// Game begins with player "X"
let currentPlayer = "X";

// Function to update the board and handle player moves
function makeMove(position) {
  if (winner) {
    return;
  }
  if (board[position - 1] === " ") {
    // Make the move if the cell is empty
    board =
      board.substr(0, position - 1) + currentPlayer + board.substr(position);
    document.getElementById("cell-" + position).textContent = currentPlayer;

    // Switch to the other player for the next move
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    // Checking for winner
    let gameWinner = checkWinner();
    if (gameWinner) {
      alert("Game Over! The winner is " + winner);
    }

    // Checking for Draw
    draw = checkDraw();
    if (draw) {
      alert("Game Over, Draw!");
    }
    // Update Kontent here. Management API??
  }
}

// Function for checking winner
function checkWinner() {
  const horizontalXWin = checkHorizontal("X");
  if (horizontalXWin) return true;

  const horizontalOWin = checkHorizontal("O");
  if (horizontalOWin) return true;

  const verticalXWin = checkVertical("X");
  if (verticalXWin) return true;

  const verticalOWin = checkVertical("O");
  if (verticalOWin) return true;

  const diagonalXWin = checkDiagonal("X");
  if (diagonalXWin) return true;

  const diagonalOWin = checkDiagonal("O");
  if (diagonalOWin) return true;
}

// Function for checking draw
function checkDraw() {
  return board.split("").every((letter) => letter === "X" || letter === "O");
}

// Checks for 3 consecutive horizontal characters
function checkHorizontal(char) {
  console.log("This runs");
  if (
    board.charAt(0) === char &&
    board.charAt(1) === char &&
    board.charAt(2) === char
  ) {
    winner = char;
    return true;
  }
  if (
    board.charAt(3) === char &&
    board.charAt(4) === char &&
    board.charAt(5) === char
  ) {
    winner = char;
    return true;
  }
  if (
    board.charAt(6) === char &&
    board.charAt(7) === char &&
    board.charAt(8) === char
  ) {
    winner = char;
    return true;
  }
}

// Checks for 3 consecutive vertical characters
function checkVertical(char) {
  console.log("This runs");
  if (
    board.charAt(0) === char &&
    board.charAt(3) === char &&
    board.charAt(6) === char
  ) {
    winner = char;
    return true;
  }
  if (
    board.charAt(1) === char &&
    board.charAt(4) === char &&
    board.charAt(7) === char
  ) {
    winner = char;
    return true;
  }
  if (
    board.charAt(2) === char &&
    board.charAt(5) === char &&
    board.charAt(8) === char
  ) {
    winner = char;
    return true;
  }
}

// Checks for 3 consecutive diagonal characters
function checkDiagonal(char) {
  console.log("This runs");
  if (
    board.charAt(0) === char &&
    board.charAt(4) === char &&
    board.charAt(8) === char
  ) {
    winner = char;
    return true;
  }
  if (
    board.charAt(2) === char &&
    board.charAt(4) === char &&
    board.charAt(6) === char
  ) {
    winner = char;
    return true;
  }
}

// Creates an event listener for every table cell
document.querySelectorAll("td").forEach((el) =>
  el.addEventListener("click", (event) => {
    // Takes numerical part of element ID and coerces into number
    const position = +event.target.id.split("-")[1];
    makeMove(position);
  })
);

// ??
window.addEventListener("load", async () => {
  const data = await fetchKontentData();
  console.log(data);
  const update = await updateKontentData();
  console.log(update);
});
