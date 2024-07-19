import { useCallback, useEffect, useMemo, useState } from "react";
import { Grid } from "./Grid";
import { GridItem, GridValuesDictionary, HistoryItem, Players } from "./types";
import { createGridArray, hasPlayerWon } from "./utils";
import { BOX_CLICKED, eventBus } from "./eventBus";

export function TicTacToe() {
  const [gridValues, setGridValues] = useState<GridValuesDictionary>({});
  const [currentPlayer, setCurrentPlayer] = useState<Players>(Players.X);
  const [winner, setWinner] = useState<Players | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    eventBus.on(BOX_CLICKED, (cellNumber: number) => {
      if (winner) {
        // If there is a winner, don't allow any other inputs until the user resets the game
        return;
      }
      const gridItem: GridItem = {
        key: cellNumber,
        renderText: currentPlayer,
      };
      pushToHistory({ gridItem, player: currentPlayer });
    });

    return () => {
      eventBus.off(BOX_CLICKED);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, currentPlayer, winner]);

  useEffect(() => {
    refreshGrid();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  useEffect(() => {
    checkIfCurrentPlayerHasWon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridValues]);

  function pushToHistory(historyItem: HistoryItem) {
    const currentHistory = [...history, historyItem];
    // Always keep the history to 6 items
    if (currentHistory.length > 6) {
      currentHistory.shift();
    }
    setHistory(currentHistory);
  }

  function refreshGrid() {
    const newGridValues: GridValuesDictionary = {};
    history.forEach((historyItem: HistoryItem) => {
      const { gridItem } = historyItem;
      const boxNumber = gridItem.key;
      newGridValues[boxNumber] = gridItem;
    });
    setGridValues(newGridValues);
    setDisappearingBox();
  }

  function setDisappearingBox() {
    setGridValues((oldGridValues) => {
      if (history.length === 6) {
        const firstItem = history[0];
        const newGridValues = { ...oldGridValues };
        newGridValues[firstItem.gridItem.key] = {
          key: firstItem.gridItem.key,
          renderText: firstItem.gridItem.renderText,
          isDisappearing: true,
        };
        return newGridValues;
      } else {
        return oldGridValues;
      }
    });
  }

  const switchPlayer = useCallback(() => {
    if (currentPlayer === Players.X) {
      setCurrentPlayer(Players.O);
    } else {
      setCurrentPlayer(Players.X);
    }
  }, [currentPlayer]);

  function checkIfCurrentPlayerHasWon() {
    const positionsOfCurrentPlayer: number[] = [];
    for (const boxNumber in gridValues) {
      if (gridValues[boxNumber]?.renderText === currentPlayer) {
        positionsOfCurrentPlayer.push(parseInt(boxNumber));
      }
    }
    if (hasPlayerWon(positionsOfCurrentPlayer)) {
      console.log(`Player ${currentPlayer} has won!`);
      setWinner(currentPlayer);
    } else {
      switchPlayer();
    }
  }

  function resetGame() {
    setGridValues({});
    setHistory([]);
    refreshGrid();
    setCurrentPlayer(Players.X);
    setWinner(null);
  }

  const gridCreationArray = useMemo(() => {
    return createGridArray(3, 3);
  }, []);

  return (
    <div>
      {!winner && <h2>Current Player: {currentPlayer}</h2>}
      <Grid gridArray={gridCreationArray} gridValues={gridValues} />
      {winner && (
        <h1 className={`victory-confetti-${winner}`}>Player X wins</h1>
      )}
      {
        <button onClick={resetGame} className="resetButton">
          Reset Game
        </button>
      }
    </div>
  );
}
