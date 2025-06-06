// 1. Define the board variable
const board = [
    [-1, -1, 1, 1, 1, -1, -1],
    [-1, -1, 1, 1, 1, -1, -1],
    [ 1, 1, 1, 1, 1, 1, 1],
    [ 1, 1, 1, 0, 1, 1, 1], // Center is initially empty
    [ 1, 1, 1, 1, 1, 1, 1],
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

// 6. Implement getPossibleMoves function - MOVED TO solver.worker.js

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
// Solver functions like isGameWon, findAllSolutions, getPossibleMoves
// have been moved to solver.worker.js.
// Helper functions like isValidPosition, isPeg, isEmpty, makeMove are kept
// as they might be used by UI logic (e.g. rendering a solution step-by-step,
// or if interactive board features were added).


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
    [-1, -1, 1, 1, 1, -1, -1],
    [-1, -1, 1, 1, 1, -1, -1],
    [ 1, 1, 1, 1, 1, 1, 1],
    [ 1, 1, 1, 0, 1, 1, 1], // Center is initially empty
    [ 1, 1, 1, 1, 1, 1, 1],
    [-1, -1, 1, 1, 1, -1, -1],
    [-1, -1, 1, 1, 1, -1, -1]
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
        // Initial message upon click, before the timeout logic
        statusMessageContainer.textContent = 'Preparing to find all solutions...';
        solutionStepsContainer.innerHTML = '';
        solveButton.disabled = true;
        renderBoard(initialBoard, boardContainer);

        setTimeout(() => {
            let currentSolutionPath = []; // This is used by findAllSolutions as a temporary path builder
            let boardToSolve = initialBoard.map(row => [...row]);
            let stats = { exploredPaths: 0 };
            let allSolutions = [];

            // Read and validate maxSolutions from input
            const maxSolutionsInputElement = document.getElementById('maxSolutionsInput');
            let userInputMaxSolutions = 10; // Default value
            if (maxSolutionsInputElement) {
                const parsedValue = parseInt(maxSolutionsInputElement.value, 10);
                if (!isNaN(parsedValue) && parsedValue > 0) {
                    userInputMaxSolutions = parsedValue;
                } else {
                    maxSolutionsInputElement.value = '10'; // Reset invalid input to default
                }
            }
            const maxSolutions = userInputMaxSolutions; // Final value to use

            statusMessageContainer.textContent = `Finding up to ${maxSolutions} solution(s)... This may take some time. Please wait.`;

            const startTime = performance.now();
            findAllSolutions(boardToSolve, currentSolutionPath, stats, allSolutions, maxSolutions);
            const endTime = performance.now();

            if (allSolutions.length > 0) {
                if (allSolutions.length === maxSolutions) {
                    statusMessageContainer.textContent = `Reached solution limit (${maxSolutions} solution(s) found) in ${(endTime - startTime).toFixed(2)} ms! (${stats.exploredPaths} paths explored). Displaying first solution.`;
                } else {
                    statusMessageContainer.textContent = `Found ${allSolutions.length} solution(s) (limit was ${maxSolutions}) in ${(endTime - startTime).toFixed(2)} ms! (${stats.exploredPaths} paths explored). Displaying first solution.`;
                }
                renderSolution(allSolutions[0], solutionStepsContainer);

                let firstSolutionBoard = initialBoard.map(row => [...row]);
                allSolutions[0].forEach(move => {
                    firstSolutionBoard = makeMove(firstSolutionBoard, move);
                });
                renderBoard(firstSolutionBoard, boardContainer);

            } else {
                statusMessageContainer.textContent = `No solutions found (limit was ${maxSolutions}) after exploring ${stats.exploredPaths} paths.`;
                renderBoard(initialBoard, boardContainer);
            }
            solveButton.disabled = false;
        }, 10); // Small timeout
    });
});
