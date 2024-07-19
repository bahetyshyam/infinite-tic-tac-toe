import mitt from "mitt";
export const BOX_CLICKED = "boxClicked";
export type BoxClickedEventData = number;

type Events = {
  [BOX_CLICKED]: BoxClickedEventData;
};

export const eventBus = mitt<Events>();
