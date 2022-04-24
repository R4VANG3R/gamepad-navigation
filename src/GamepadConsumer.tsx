import { useEffect } from "react";
import {
  focusNextElement,
  useGamepadNavigation,
} from "./navigation/useGamepadNavigation";

export const PlayerOne = () => {
  const [xDir, yDir] = useGamepadNavigation();

  useEffect(() => {
    if (xDir === -1) {
      focusNextElement(true);
    }
    if (xDir === 1) {
      focusNextElement();
    }
  }, [xDir]);

  return <></>;

  // return <span>{gamepad != null && "Player One connected"}</span>;
};
