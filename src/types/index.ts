export interface GridItem {
  key: number;
  renderText?: Players;
  isDisappearing?: boolean;
  isWinner?: boolean;
}

export type GridArray<T> = T[][];

export enum Players {
  X = "X",
  O = "O",
}

export type HistoryItem = {
  gridItem: GridItem;
  player: Players;
};

export type GridValuesDictionary = {
  [key: number]: GridItem | undefined;
};
