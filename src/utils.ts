export function createGridArray(
  numberOfRows: number,
  numberOfColumns: number,
): number[][] {
  const gridArray = [];
  let key = 1;
  for (let i = 0; i < numberOfRows; i++) {
    const row = [];
    for (let j = 0; j < numberOfColumns; j++) {
      row.push(key);
      key++;
    }
    gridArray.push(row);
  }
  return gridArray;
}

export const ticTacToeWinningCombinations: number[][] = [
  [1, 2, 3], //top row
  [4, 5, 6], //middle row
  [7, 8, 9], //bottom row
  [1, 4, 7], //left column
  [2, 5, 8], //middle column
  [3, 6, 9], //right column
  [1, 5, 9], //diagonal
  [3, 5, 7], //diagonal
];

export function hasPlayerWon(
  currentPositionsOfPlayer: number[],
  winningCombinations = ticTacToeWinningCombinations,
) {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (
      currentPositionsOfPlayer.includes(a) &&
      currentPositionsOfPlayer.includes(b) &&
      currentPositionsOfPlayer.includes(c)
    ) {
      return true;
    }
  }
  return false;
}
