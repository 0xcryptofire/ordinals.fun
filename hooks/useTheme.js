import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

const useCustomTheme = () => {
  const { isDarkMode, setDarkMode } = useContext(ThemeContext);
  return { isDark: isDarkMode, setDarkMode: setDarkMode };
};

export default useCustomTheme;
