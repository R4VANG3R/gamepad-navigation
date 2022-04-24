import { useGamepad } from "../gamepad/Gamepad";
import { useCallback, useRef, useState } from "react";
import { useDebounce } from "react-use";

export function useGamepadNavigation() {
  const gamepad = useGamepad(0);

  const [xDir, setXDir] = useState(0);
  const [yDir, setYDir] = useState(0);

  useDebounce(
    () => {
      if (gamepad == null) return;
      // console.log("Gamepad #0 updated", gamepad);

      if (gamepad.buttons[14]?.pressed || gamepad.axes[0] <= -0.9) setXDir(-1);
      else if (gamepad.buttons[15]?.pressed || gamepad.axes[0] >= 0.9)
        setXDir(1);
      else setXDir(0);

      if (gamepad.buttons[12]?.pressed || gamepad.axes[1] <= -0.9) setYDir(-1);
      else if (gamepad.buttons[13]?.pressed || gamepad.axes[1] >= 0.9)
        setYDir(1);
      else setYDir(0);
    },
    5,
    [gamepad]
  );

  return [xDir, yDir];
}

const focusableElements =
  'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';

export function useFocusGroup<El extends HTMLElement = HTMLDivElement>() {
  const groupRef = useRef<El>(null);

  const getFocusableElementCount = useCallback(() => {
    if (groupRef.current == null) return;
    return Array.from(
      groupRef.current.querySelectorAll<HTMLElement>(focusableElements)
    ).length;
  }, [groupRef.current]);

  const focusItem = useCallback((index = 0) => {
    if (groupRef.current == null) return;

    const focusable = Array.from(
      groupRef.current.querySelectorAll<HTMLElement>(focusableElements)
    );
    focusable[index]?.focus();
  }, []);

  return {
    groupRef,
    focusItem,
    getFocusableElementCount,
  };
}

export function focusNextElement(reverse = false) {
  //add all elements we want to include in our selection
  const focusableElements =
    'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
  if (document.activeElement) {
    const focusable = Array.from(
      document.querySelectorAll<HTMLElement>(focusableElements)
    );
    const index = focusable.indexOf(document.activeElement as HTMLElement);
    let nextElement = focusable[0];
    if (index > -1) {
      nextElement = focusable[index + (reverse ? -1 : 1)];
    }
    nextElement?.focus();
  }
}
