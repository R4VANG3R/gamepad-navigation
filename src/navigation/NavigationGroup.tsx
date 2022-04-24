import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useNavigation } from "./NavigationProvider";
import { useFocusGroup, useGamepadNavigation } from "./useGamepadNavigation";

type Props = {
  groupIndex: number;
  className: string;
};

export const NavigationGroup = ({
  children,
  groupIndex,
  ...rest
}: PropsWithChildren<Props>) => {
  const { x, setX, y } = useNavigation();
  const [xDir] = useGamepadNavigation();
  const { groupRef, focusItem, getFocusableElementCount } = useFocusGroup();

  const [xMax, setXMax] = useState(0);

  // Set group size (xMax)
  useEffect(() => {
    let focusableElements = getFocusableElementCount();
    console.log("querying maxX");

    if (focusableElements != null) {
      setXMax(focusableElements - 1);
    }
  }, [getFocusableElementCount]);

  // Update group item index when receiving input
  useEffect(() => {
    if (groupRef.current == null || y !== groupIndex) return;

    const newX = Math.min(Math.max(x + xDir, 0), xMax);
    setX(newX);
  }, [xDir, y, groupIndex]);

  // Focus the item in the group when x (or y) changes
  useEffect(() => {
    if (y !== groupIndex) return;

    focusItem(x);
  }, [x, y, focusItem]);

  return (
    <div ref={groupRef} data-nav-group="" {...rest}>
      {children}
    </div>
  );
};

export const GlobalNavigation = ({ children }: PropsWithChildren<unknown>) => {
  const { setX, y, setY } = useNavigation();
  const [_, yDir] = useGamepadNavigation();

  const ref = useRef<HTMLDivElement>(null);
  const [maxY, setMaxY] = useState(0);

  useEffect(() => {
    if (ref.current == null) return;
    console.log("querying maxY");
    setMaxY(ref.current.querySelectorAll("[data-nav-group]").length - 1);
  }, [ref.current]);

  useEffect(() => {
    const newY = Math.min(Math.max(y + yDir, 0), maxY);
    setY(newY);
    // Also reset x so it starts from the beginning
    // setX(0);
  }, [yDir, setX, setY, maxY]);

  return (
    <div ref={ref} style={{ display: "contents" }}>
      {children}
    </div>
  );
};
