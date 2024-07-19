import { useEffect, useMemo, useState } from "react";
import { Grid } from "./Grid";
import { GridItem, GridValuesDictionary, HistoryItem, Players } from "../types";
import { createGridArray, hasPlayerWon } from "../utils/utils";
import { BOX_CLICKED, eventBus } from "../eventBus";

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
  }, [history, currentPlayer]);

  useEffect(() => {
    if (!winner) {
      refreshGrid();
    }
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  useEffect(() => {
    if (!winner) {
      checkIfCurrentPlayerHasWon();
    }
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

  function switchPlayer() {
    if (currentPlayer === Players.X) {
      setCurrentPlayer(Players.O);
    } else {
      setCurrentPlayer(Players.X);
    }
  }

  function checkIfCurrentPlayerHasWon() {
    const positionsOfCurrentPlayer: number[] = [];
    for (const boxNumber in gridValues) {
      if (gridValues[boxNumber]?.renderText === currentPlayer) {
        positionsOfCurrentPlayer.push(parseInt(boxNumber));
      }
    }
    const winnerBoxes = hasPlayerWon(positionsOfCurrentPlayer);
    if (winnerBoxes) {
      setWinner(currentPlayer);
      highlightWinnerBoxes(winnerBoxes);
    } else {
      switchPlayer();
    }
  }

  function highlightWinnerBoxes(winnerBoxes: number[]) {
    setGridValues((oldGridValues) => {
      const newGridValues = { ...oldGridValues };
      winnerBoxes.forEach((boxNumber) => {
        newGridValues[boxNumber] = {
          ...oldGridValues[boxNumber],
          key: boxNumber,
          isWinner: true,
        };
      });
      return newGridValues;
    });
  }

  const containerClicked = () => {
    if (winner) {
      resetGame();
    }
  };

  function resetGame() {
    setWinner(null);
    setCurrentPlayer(Players.O);
    setHistory([]);
  }

  const gridCreationArray = useMemo(() => {
    return createGridArray(3, 3);
  }, []);

  const currentPlayerClass =
    currentPlayer === Players.X ? "playerX" : "playerO";

  const winnerPlayerClass = winner === Players.X ? "playerX" : "playerO";

  return (
    <div onClick={containerClicked} className="container">
      {winner && (
        <div className={`victory-confetti ${winnerPlayerClass}`}>
          Player {winner} wins
        </div>
      )}
      {!winner && (
        <div className={`currentPlayer ${currentPlayerClass}`}>
          Current Player: {currentPlayer}
        </div>
      )}

      <Grid gridArray={gridCreationArray} gridValues={gridValues} />
    </div>
  );
}
