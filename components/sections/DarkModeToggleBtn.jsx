import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useCustomTheme from "../../hooks/useTheme";
import { updateMode } from "@/store/slices/theme";
import { useTheme } from "next-themes";

export default function DarkModeToggleBtn() {
  const dispatch = useDispatch();
  const { isDark, setDarkMode } = useCustomTheme();
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = (checked) => {
    dispatch(updateMode(checked));
    setDarkMode(checked);
    setTimeout(() => {
      if (checked) {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    }, 400);
  };

  useEffect(() => {
    if (theme === "system") {
      dispatch(updateMode(false));
      setDarkMode(false);
      setTimeout(() => {
        setTheme("dark");
      }, 400);
    }
  }, [theme]);

  return (
    <DarkModeSwitch
      className="text-white  bg-[#080f16ee] p-1 rounded-full"
      checked={isDark}
      onChange={toggleDarkMode}
      size={30}
    />
  );
}
