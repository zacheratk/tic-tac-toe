/**
 * Values for representing each type of marker
 */
const PLAYER_ONE_MARKER = "x";
const PLAYER_TWO_MARKER = "o";
const EMPTY_MARKER = " ";
const values = {PLAYER_ONE_MARKER, PLAYER_TWO_MARKER, EMPTY_MARKER};

/**
 * The Gameboard represents the state of the tic tac toe board
 */
function Gameboard() {
    const board = [];

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(new Cell());
            board[i][j].setValue(values.EMPTY_MARKER);
        }
    }

    /**
     * Return the board 2D array
     */
    const getBoard = () => board;

    /**
     * Prints the Gameboard in the console.
     */
    const printBoard = () => {
       let output = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                output += ` ${board[i][j].getValue()} ${(j != 2) ? "|" : '\n'}`;
            }
            if (i != 2) {
                output += "---+---+---\n";
            }
        }

        console.log(output);
    }

    return {getBoard, printBoard};
};

/**
 * A Cell represents a space on the Gameboard, that can be
 * either empty or filled (with an x or an o)
 */
function Cell() {
    this.value = values.EMPTY_MARKER;

    /**
     * Sets the value of the cell, if the value is known
     * @param {string} value 
     */
    const setValue = (value) => {
        if (Object.values(values).includes(value)) {
            this.value = value;
        }
    }

    const getValue = () => {
        return this.value;
    }

    /**
     * Checks if the cell is empty
     * @returns {boolean} True is empty, false otherwise
     */
    const isEmpty = () => {
        return this.value == values.EMPTY_MARKER;
    }

    return {setValue, getValue, isEmpty}
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();
    let gameRunning = true;

    const players = [
        {
            name: playerOneName,
            marker: values.PLAYER_ONE_MARKER
        },
        {
            name: playerTwoName,
            marker: values.PLAYER_TWO_MARKER
        }
    ];

    let activePlayer = players[0];

    let turnCount = 0;
    /**
     * Change the activePlayer to the other player, 
     */
    const switchPlayerTurn = () => {
        activePlayer = players[++turnCount % 2];
    }

    /**
     * Returns the player who's turn it is
     */
    const getActivePlayer = () => {
        return activePlayer;
    }

    /**
     * Places either an x or o on the board
     * @param row Defines what row a given cell is
     * @param column Defines what column a given cell is
     */
    const playMove = (row, column) => {
            if (gameRunning && 0 <= row < 3 && 0 <= column < 3 && board.getBoard()[row][column].isEmpty()) {
                board.getBoard()[row][column].setValue(getActivePlayer().marker);
                return true;
            } else {
                console.log("Tried to play in invalid place");
                return false;
            }
        
    }

    const playTurn = (row, column) => {
        if (playMove(row, column)) {
            if (checkBoard(row, column)) {
                return `${activePlayer.name} wins!`
            } else {
                switchPlayerTurn();
                return '';
            }
        }
    }

    const checkBoard = (row, column) => {
        return (checkRow(row) || checkCol(column) || checkDiags());
    }

    const checkRow = (row) => {
        const currentBoard = board.getBoard();
        if (!currentBoard[row][0].isEmpty() && currentBoard[row][0].getValue() == currentBoard[row][1].getValue() && currentBoard[row][0].getValue() == currentBoard[row][2].getValue()) {
            gameRunning = false;
            return true;
        } else {
            return false;
        }
    }

    const checkCol = (column) => {
        const currentBoard = board.getBoard();
        if (!currentBoard[0][column].isEmpty() && currentBoard[0][column].getValue() == currentBoard[1][column].getValue() && currentBoard[0][column].getValue() == currentBoard[2][column].getValue()) {
            gameRunning = false;
            return true;
        } else {
            return false;
        }
    }

    const checkDiags = () => {
        const currentBoard = board.getBoard();
        if (!currentBoard[1][1].isEmpty() && currentBoard[1][1].getValue() == currentBoard[0][0].getValue() && currentBoard[1][1].getValue() == currentBoard[2][2].getValue()) {
            gameRunning = false;
            return true;
        } else if (!currentBoard[1][1].isEmpty() && currentBoard[0][2].getValue() == currentBoard[1][1].getValue() && currentBoard[0][2].getValue() == currentBoard[2][0].getValue()) {
            gameRunning = false;
            return true;

        } else {
            return false;
        }
    }

    const printNewTurn = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    };

    const isFullBoard = () => {
        for (let i = 0; i < board.getBoard().length; i++) {
            for (let j = 0; j < board.getBoard()[i].length; j++) {
                if (board.getBoard()[i][j].isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    }

    const isGameRunning = () => { return gameRunning; }

    printNewTurn();

    return {playTurn, board, isFullBoard, getActivePlayer, isGameRunning};
}


function displayGame() {
    const boardElement = document.querySelector(".board");
    const turnDisplay = document.querySelector("#turn-display")
    const gameContainer = document.querySelector(".container");
    const newGameButton = document.querySelector("#new-game");
    const playerOneNameInput = document.querySelector("#player-one");
    const playerTwoNameInput = document.querySelector("#player-two");

    newGameButton.addEventListener("click", () => {
        let game;
        if (playerOneNameInput.value && playerTwoNameInput.value) {
            game = GameController(playerOneNameInput.value, playerTwoNameInput.value);
        } else {
            game = GameController();
        }

        // "Resets" the board if a previous game was played
        boardElement.innerHTML = "";
        
        gameContainer.hidden = false;

        turnDisplay.textContent = `${game.getActivePlayer().name}'s turn`;
        // Array of cell elements that are displayed
        const board = game.board.getBoard();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement("div");
                cell.className = "marker";
                cell.addEventListener("click", () => {
                    if (game.isGameRunning()) {
                        let winner = game.playTurn(i, j);
                        cell.innerHTML = `<p>${board[i][j].getValue()}</p>`;
                        if (winner) {
                            turnDisplay.textContent = winner;
                        } else if (game.isFullBoard()) {
                            turnDisplay.textContent = "Tie!";
                        } else {
                            turnDisplay.textContent = `${game.getActivePlayer().name}'s turn`;
                        }
                    }
                });
                boardElement.appendChild(cell);
            }
        }
    })
}

displayGame();
