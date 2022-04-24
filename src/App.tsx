import styles from "./styles.module.scss";
import { GamepadProvider } from "./gamepad/Gamepad";
import {
  GlobalNavigation,
  NavigationGroup,
} from "./navigation/NavigationGroup";
import NavigationProvider, {
  useNavigation,
} from "./navigation/NavigationProvider";

export default function App() {
  return (
    <NavigationProvider>
      <GamepadProvider>
        <Home />
      </GamepadProvider>
    </NavigationProvider>
  );
}

function DebugNavigation() {
  const { x, y } = useNavigation();

  return (
    <span>
      x: {x} y: {y}
    </span>
  );
}

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function Home() {
  return (
    <div className={styles.app}>
      <h1>Gamepad API</h1>
      <DebugNavigation />

      <div className={styles.stack}>
        <GlobalNavigation>
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j}>
              <div>Group {j}</div>
              <NavigationGroup className={styles.flex} groupIndex={j}>
                {Array.from({ length: randomRange(2, 9) }).map((_, i) => (
                  <div key={i} className={styles.item} tabIndex={0} />
                ))}
              </NavigationGroup>
            </div>
          ))}
        </GlobalNavigation>
      </div>
    </div>
  );
}
