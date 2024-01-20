import React from "react";
import { useEffect } from "react";
import { useThemeStore } from "../store/hooks";
import { useTheme } from "next-themes";

const ThemeContext = React.createContext();

const ThemeContextProvider = (props) => {
  const [isDarkMode, setDarkMode] = React.useState(false);
  const { dark } = useThemeStore();
  const { setTheme } = useTheme();

  useEffect(() => {
    setDarkMode(dark);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
    //  console.log('sadfasdf')
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setDarkMode }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export { ThemeContextProvider, ThemeContext };
