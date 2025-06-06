// --- Helper functions for the Solver Worker ---
// These are duplicated from script.js or are self-contained versions
// for the worker's scope.

function isValidPosition(board, row, col) {
    // Check if row and col are within the board's bounds
    if (row >= 0 && row < board.length && col >= 0 && col < board[row].length) {
        // Then check if the position is not marked as invalid (-1)
        return board[row][col] !== -1;
    }
    return false; // Out of bounds
}

function isPeg(board, row, col) {
    // A position has a peg if it's a valid position and its value is 1
    return isValidPosition(board, row, col) && board[row][col] === 1;
}

function isEmpty(board, row, col) {
    // A position is empty if it's a valid position and its value is 0
    return isValidPosition(board, row, col) && board[row][col] === 0;
}

function makeMove(originalBoard, move) {
    // Create a deep copy of the board to avoid modifying the original
    let newBoard = originalBoard.map(arr => [...arr]);

    // Apply the move:
    // 1. Vacate the 'from' position
    newBoard[move.from[0]][move.from[1]] = 0;
    // 2. Remove the 'over' peg
    newBoard[move.over[0]][move.over[1]] = 0;
    // 3. Place a peg in the 'to' position
    newBoard[move.to[0]][move.to[1]] = 1;

    return newBoard;
}

function getPossibleMoves(board) {
    const moves = [];
    // Define the four orthogonal directions (rowChange, colChange)
    const directions = [
        { r: 0, c: 1 },  // Right
        { r: 0, c: -1 }, // Left
        { r: 1, c: 0 },  // Down
        { r: -1, c: 0 }  // Up
    ];

    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (isPeg(board, r, c)) { // If there's a peg at (r,c)
                for (const dir of directions) {
                    // Calculate the position of the peg to be jumped
                    const jumpedR = r + dir.r;
                    const jumpedC = c + dir.c;
                    // Calculate the landing position
                    const toR = r + 2 * dir.r;
                    const toC = c + 2 * dir.c;

                    // Check if the move is valid:
                    // - Is there a peg at the jumped position?
                    // - Is the landing position empty? (isEmpty also checks isValidPosition)
                    if (isPeg(board, jumpedR, jumpedC) && isEmpty(board, toR, toC)) {
                        moves.push({
                            from: [r, c],
                            over: [jumpedR, jumpedC],
                            to: [toR, toC]
                        });
                    }
                }
            }
        }
    }
    return moves;
}

function isGameWon(board) {
    let pegCount = 0;
    let lastPegPos = null; // Not strictly needed for win condition, but could be useful

    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (isPeg(board, r, c)) {
                pegCount++;
                lastPegPos = { r, c };
            }
        }
    }
    // Standard win: 1 peg left, and it's in the center (3,3 for a 7x7 board)
    return pegCount === 1 && board[3] && board[3][3] === 1;
}

// --- Main Solver Logic (findAllSolutions) ---
function findAllSolutions(currentBoard, currentPath, stats, allSolutionsList, maxSolutions) {
    stats.exploredPaths++;

    // Live update callback was removed from here in previous user request.

    if (isGameWon(currentBoard)) {
        allSolutionsList.push([...currentPath]);
        if (allSolutionsList.length >= maxSolutions) {
            return true; // Signal to stop searching
        }
        return false; // Found a solution, but limit not reached
    }

    const possibleMoves = getPossibleMoves(currentBoard);

    if (possibleMoves.length === 0) {
        return false; // Dead end
    }

    for (const move of possibleMoves) {
        const nextBoard = makeMove(currentBoard, move);
        currentPath.push(move);

        if (findAllSolutions(nextBoard, currentPath, stats, allSolutionsList, maxSolutions)) {
            currentPath.pop();
            return true; // Limit reached, propagate stop signal
        }

        currentPath.pop();
    }
    return false;
}

// Worker message handling will be added in the next step of the plan.
// For now, this file just contains the functions.

// --- Worker Message Handling ---
self.onmessage = function(e) {
    // console.log('[Worker] Message received from main script:', e.data); // Optional: for worker debugging
    const { board: currentBoard, maxSolutions } = e.data;

    let stats = { exploredPaths: 0 };
    let allSolutions = [];
    let currentPath = []; // Initial empty path for the solver

    findAllSolutions(currentBoard, currentPath, stats, allSolutions, maxSolutions);

    // console.log('[Worker] Sending results back to main script:', { solutions: allSolutions, stats: stats }); // Optional: for worker debugging
    self.postMessage({ solutions: allSolutions, stats: stats });

    self.close(); // Terminate the worker as its task is complete
};
