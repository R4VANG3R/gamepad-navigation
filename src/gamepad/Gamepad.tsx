import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRafLoop } from "react-use";
import { isEqual } from "lodash-es";

type GamepadRecord = Array<Gamepad | null>;

export interface IGamepadContext {
  gamepads: GamepadRecord;
}

export const GamepadContext = createContext<IGamepadContext>({ gamepads: [] });

export function GamepadProvider({ children }: PropsWithChildren<unknown>) {
  const [gamepads, setGamepads] = useState<GamepadRecord>([]);

  /**
   * Get the gamepad information from the browser
   */
  const getGamepads = useCallback(() => {
    return navigator.getGamepads?.() ?? [];
  }, []);

  /**
   * Update the locally stored gamepad information
   * @param gamepads {GamepadRecord}
   */
  const updateGamepads = useCallback(
    (gamepads?: GamepadRecord) => setGamepads(gamepads ?? getGamepads()),
    [getGamepads]
  );

  /**
   * Setup connection listeners
   */
  useEffect(() => {
    window.addEventListener("gamepadconnected", () => updateGamepads());
    window.addEventListener("gamepaddisconnected", () => updateGamepads());

    return () => {
      window.removeEventListener("gamepadconnected", () => updateGamepads());
      window.removeEventListener("gamepaddisconnected", () => updateGamepads());
    };
  }, [updateGamepads]);

  /**
   * Update the gamepad information whenever something changes
   * This includes button presses or axis changes
   */
  const [loopStop, loopStart, isActive] = useRafLoop((time) => {
    const newGamepads = getGamepads();
    if (!isEqual(gamepads, newGamepads)) updateGamepads(newGamepads);
  }, false);

  // Start/stop the RAF loop based on if there are any gamepads connected
  useEffect(() => {
    if (gamepads.filter((g) => g != null).length === 0) loopStop();
    else if (!isActive()) loopStart();
  }, [gamepads, loopStop, loopStart, isActive]);

  return (
    <GamepadContext.Provider value={{ gamepads }}>
      {children}
    </GamepadContext.Provider>
  );
}

/**
 * Get all gamepads
 * Can only be used within a
 * ```jsx
 * <GamepadProvider/>
 * ```
 */
export function useGamepads() {
  const context = useContext(GamepadContext);
  if (context == null)
    throw Error("You have to use this inside the GamepadProvider.");
  return context.gamepads;
}

/**
 * Get the controller for a certain player
 * @param index {number} The "player" index
 */
export function useGamepad(index: number) {
  return useGamepads()?.[index];
}
