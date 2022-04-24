import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

type Setter = (v: number) => void;

interface INavigationContext {
  x: number;
  setX: Setter;
  y: number;
  setY: Setter;
}

export const NavigationContext = createContext<INavigationContext | undefined>(
  undefined
);

const NavigationProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const contextValue = useMemo(() => ({ x, setX, y, setY }), [x, y]);

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context == null)
    throw Error("You can only use this within a NavigationProvider.");
  return context;
}
