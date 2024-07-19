import { Box } from "./Box";
import { GridValuesDictionary } from "../types";

interface IProps {
  gridArray: number[][];
  gridValues: GridValuesDictionary;
}

export function Grid({ gridArray, gridValues }: Readonly<IProps>) {
  return (
    <div>
      {gridArray.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cellNumber) => {
            const gridItem = gridValues[cellNumber];
            return (
              <Box
                key={cellNumber}
                cellNumber={cellNumber}
                renderText={gridItem?.renderText}
                isDisappearing={gridItem?.isDisappearing}
                isWinner={gridItem?.isWinner}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
