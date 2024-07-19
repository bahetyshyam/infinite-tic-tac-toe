import { Players } from "./types";
import { BOX_CLICKED, eventBus } from "./eventBus";
import { useMemo } from "react";

interface IProps {
  renderText?: Players;
  isDisappearing?: boolean;
  cellNumber: number;
}

function generateRandomNumber(min: number = 30, max: number = 60) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function Box({
  renderText,
  isDisappearing,
  cellNumber,
}: Readonly<IProps>) {
  const boxStylesObject = useMemo(() => {
    return {
      borderTopLeftRadius: `${generateRandomNumber()}px ${generateRandomNumber()}px`,
      borderTopRightRadius: `${generateRandomNumber()}px ${generateRandomNumber()}px`,
      borderBottomLeftRadius: `${generateRandomNumber()}px ${generateRandomNumber()}px`,
      borderBottomRightRadius: `${generateRandomNumber()}px ${generateRandomNumber()}px`,
    };
  }, []);

  function boxClicked() {
    if (renderText) return;
    eventBus.emit(BOX_CLICKED, cellNumber);
  }

  // Determine the class for the player's move
  const playerClass =
    renderText === Players.X
      ? "playerX"
      : renderText === Players.O
        ? "playerO"
        : "";

  return (
    <div
      onClick={boxClicked}
      style={boxStylesObject}
      className={`box ${playerClass}`}
    >
      {renderText && (
        <span className={`textFadeIn ${isDisappearing ? "disappearing" : ""}`}>
          {renderText}
        </span>
      )}
    </div>
  );
}
