// 1. Define the board variable
const board = [
    [-1, -1, 1, 1, 1, -1, -1],
    [-1, -1, 1, 1, 1, -1, -1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1], // Center is initially empty
    [1, 1, 1, 1, 1, 1, 1],
    [-1, -1, 1, 1, 1, -1, -1],
    [-1, -1, 1, 1, 1, -1, -1]
];

// 2. Implement displayBoard function
function displayBoard(board) {
    console.log("Current Board:");
    for (let i = 0; i < board.length; i++) {
        let rowString = "";
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === -1) {
                rowString += "  "; // Represent -1 as empty space for alignment
            } else {
                rowString += board[i][j] + " ";
            }
        }
        console.log(rowString);
    }
}

// 3. Implement isValidPosition function
function isValidPosition(board, row, col) {
    if (row >= 0 && row < board.length && col >= 0 && col < board[row].length) {
        return board[row][col] !== -1;
    }
    return false;
}

// 4. Implement isPeg function
function isPeg(board, row, col) {
    return isValidPosition(board, row, col) && board[row][col] === 1;
}

// 5. Implement isEmpty function
function isEmpty(board, row, col) {
    return isValidPosition(board, row, col) && board[row][col] === 0;
}

// 6. Implement getPossibleMoves function
function getPossibleMoves(board) {
    const moves = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // Right, Left, Down, Up

    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (isPeg(board, r, c)) {
                for (const dir of directions) {
                    const jumpedR = r + dir[0];
                    const jumpedC = c + dir[1];
                    const toR = r + 2 * dir[0];
                    const toC = c + 2 * dir[1];

                    if (isPeg(board, jumpedR, jumpedC) && isEmpty(board, toR, toC)) {
                        moves.push({ from: [r, c], over: [jumpedR, jumpedC], to: [toR, toC] });
                    }
                }
            }
        }
    }
    return moves;
}

// 7. Implement makeMove function
function makeMove(originalBoard, move) {
    let newBoard = originalBoard.map(row => [...row]); // Deep copy

    newBoard[move.from[0]][move.from[1]] = 0; // Empty the starting position
    newBoard[move.over[0]][move.over[1]] = 0; // Remove the jumped peg
    newBoard[move.to[0]][move.to[1]] = 1;     // Place peg at the landing position

    return newBoard;
}


// Test calls for previous functions (can be commented out)
console.log("--- Initial Function Tests ---");
console.log("isValidPosition(board, 0, 0):", isValidPosition(board, 0, 0)); // Expected: false
console.log("isValidPosition(board, 3, 3):", isValidPosition(board, 3, 3)); // Expected: true
console.log("isPeg(board, 0, 2):", isPeg(board, 0, 2)); // Expected: true
console.log("isEmpty(board, 3, 3):", isEmpty(board, 3, 3)); // Expected: true
console.log("isPeg(board, 3, 3):", isPeg(board, 3, 3)); // Expected: false (it's empty)
console.log("isEmpty(board, 0, 2):", isEmpty(board, 0, 2)); // Expected: false (it's a peg)
console.log("--- End of Initial Function Tests ---");


console.log("\n--- Initial Board State ---");
displayBoard(board);

// Test calls for getPossibleMoves and makeMove
// 8. Implement isGameWon function
function isGameWon(board) {
    let pegCount = 0;
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (isPeg(board, r, c)) {
                pegCount++;
            }
        }
    }
    return pegCount === 1 && isPeg(board, 3, 3);
}

// 9. Implement solve function (recursive backtracking)
function solve(currentBoard, currentPath) {
    if (isGameWon(currentBoard)) {
        return true; // Base Case 1: Win
    }

    const possibleMoves = getPossibleMoves(currentBoard);

    if (possibleMoves.length === 0) {
        return false; // Base Case 2: Dead End (no moves and not a win)
    }

    for (const move of possibleMoves) {
        const nextBoard = makeMove(currentBoard, move);
        currentPath.push(move);

        if (solve(nextBoard, currentPath)) {
            return true; // Solution found down this path
        } else {
            currentPath.pop(); // Backtrack: remove the last move
        }
    }

    return false; // No move from currentBoard leads to a solution
}


// --- Previous Test Calls (Commented out or reduced for solver focus) ---
// console.log("--- Initial Function Tests ---");
// console.log("isValidPosition(board, 0, 0):", isValidPosition(board, 0, 0));
// console.log("isValidPosition(board, 3, 3):", isValidPosition(board, 3, 3));
// console.log("isPeg(board, 0, 2):", isPeg(board, 0, 2));
// console.log("isEmpty(board, 3, 3):", isEmpty(board, 3, 3));
// console.log("--- End of Initial Function Tests ---");

// console.log("\n--- Initial Board State (before move tests) ---");
// displayBoard(board);

// console.log("\n--- Move Function Tests (Reduced) ---");
// let initialPossibleMoves = getPossibleMoves(board);
// console.log("Initial possible moves count:", initialPossibleMoves.length);
// if (initialPossibleMoves.length > 0) {
//     let boardAfterOneMove = makeMove(board, initialPossibleMoves[0]);
//     console.log("Board after one generic move (display suppressed)");
//     // displayBoard(boardAfterOneMove);
//     console.log("Original board still unchanged (display suppressed)");
//     // displayBoard(board);
// }
// --- End of Previous Test Calls ---

// --- End of Previous Test Calls ---

// --- UI Functions ---

function getBoardElement() {
    return document.getElementById('board-container');
}

function getSolutionStepsElement() {
    return document.getElementById('solution-steps');
}

function getStatusMessageElement() {
    return document.getElementById('status-message');
}

function getSolveButtonElement() {
    return document.getElementById('solve-button');
}

function renderBoard(currentBoard, containerElement) {
    containerElement.innerHTML = ''; // Clear previous board
    containerElement.style.display = 'grid';
    // Assuming board is 7x7, will be styled by CSS later
    containerElement.style.gridTemplateColumns = `repeat(${currentBoard[0].length}, 40px)`;
    containerElement.style.gridTemplateRows = `repeat(${currentBoard.length}, 40px)`;
    containerElement.style.gap = '2px'; // Small gap between cells
    containerElement.style.width = `${currentBoard[0].length * 42}px`; // Adjust width
    containerElement.style.margin = '20px auto'; // Center the board a bit

    currentBoard.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.style.width = '40px';
            cellDiv.style.height = '40px';
            cellDiv.style.border = '1px solid #ccc';
            cellDiv.style.display = 'flex';
            cellDiv.style.alignItems = 'center';
            cellDiv.style.justifyContent = 'center';
            cellDiv.style.boxSizing = 'border-box';

            if (cell === 1) { // Peg
                cellDiv.style.backgroundColor = 'brown';
                cellDiv.innerHTML = '&#9679;'; // Circle character for peg
                cellDiv.style.color = 'white';
            } else if (cell === 0) { // Empty hole
                cellDiv.style.backgroundColor = 'lightgrey';
            } else { // -1: Invalid/Off-board
                cellDiv.style.backgroundColor = 'white';
                cellDiv.style.border = '1px solid white'; // Make invisible or blend with background
            }
            containerElement.appendChild(cellDiv);
        });
    });
}

function renderSolution(path, containerElement) {
    containerElement.innerHTML = ''; // Clear previous solution
    if (!path || path.length === 0) {
        containerElement.textContent = 'No solution steps to display.';
        return;
    }
    const ul = document.createElement('ul');
    path.forEach((move, index) => {
        const li = document.createElement('li');
        li.textContent = `Move ${index + 1}: From [${move.from[0]},${move.from[1]}] to [${move.to[0]},${move.to[1]}] (jumped [${move.over[0]},${move.over[1]}])`;
        ul.appendChild(li);
    });
    containerElement.appendChild(ul);
}

// --- Main Game Logic and Event Listener ---

// Define the initial board state (as defined in previous steps)
// This is the standard English board with center empty
// The 'board' variable is already defined globally. We'll use that or redefine it locally if needed for clarity.
// For simplicity, let's use the global 'board' as the starting point, assuming it's the standard initial setup.
// Or, to be absolutely sure, we can redefine it here:
let initialBoard = [
    [-1,-1, 1, 1, 1,-1,-1],
    [-1,-1, 1, 1, 1,-1,-1],
    [ 1, 1, 1, 1, 1, 1, 1],
    [ 1, 1, 1, 0, 1, 1, 1], // Center is initially empty
    [ 1, 1, 1, 1, 1, 1, 1],
    [-1,-1, 1, 1, 1,-1,-1],
    [-1,-1, 1, 1, 1,-1,-1]
];


document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = getBoardElement();
    const solveButton = getSolveButtonElement();
    const solutionStepsContainer = getSolutionStepsElement();
    const statusMessageContainer = getStatusMessageElement();

    // Display the initial board
    renderBoard(initialBoard, boardContainer);
    statusMessageContainer.textContent = 'Ready to solve. Click the button!';

    solveButton.addEventListener('click', () => {
        statusMessageContainer.textContent = 'Solving... please wait.';
        solutionStepsContainer.innerHTML = ''; // Clear previous solution
        solveButton.disabled = true;
        // Re-render initial board before solving, using a fresh copy for the solver
        // This is important because 'solve' might be called multiple times,
        // and we want to start from the original state.
        // The 'initialBoard' variable itself is not modified by 'solve' because 'makeMove' creates copies.
        renderBoard(initialBoard, boardContainer);

        // Use a timeout to allow the UI to update before the potentially long-running solve function
        setTimeout(() => {
            let currentSolutionPath = []; // Use a fresh path array for each solve attempt
            // Make a deep copy of initialBoard to pass to the solver,
            // ensuring the original initialBoard is untouched for subsequent clicks.
            let boardToSolve = initialBoard.map(row => [...row]);

            const startTime = performance.now();
            let foundSolution = solve(boardToSolve, currentSolutionPath);
            const endTime = performance.now();

            if (foundSolution) {
                statusMessageContainer.textContent = `Solution Found in ${(endTime - startTime).toFixed(2)} ms! (${currentSolutionPath.length} moves)`;
                renderSolution(currentSolutionPath, solutionStepsContainer);

                // Display the final board state
                let finalBoardState = boardToSolve; // boardToSolve was modified by solve (via makeMove) if solution found
                                                 // Actually, solve does not modify boardToSolve directly, it uses makeMove which returns new boards.
                                                 // So, we need to reconstruct the final board from the solution path.
                finalBoardState = initialBoard.map(row => [...row]); // Start fresh
                currentSolutionPath.forEach(move => {
                    finalBoardState = makeMove(finalBoardState, move); // makeMove returns a new board
                });
                renderBoard(finalBoardState, boardContainer);

            } else {
                statusMessageContainer.textContent = 'No solution found from this configuration.';
                // Re-render the initial board if no solution is found, as the board displayed might be an intermediate one
                // if we were to display intermediate steps during solving (which we are not currently).
                // For now, the board remains the initialBoard if no solution is found.
                renderBoard(initialBoard, boardContainer);
            }
            solveButton.disabled = false;
        }, 10); // Small timeout
    });
});
