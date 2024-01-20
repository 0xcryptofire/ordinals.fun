import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    dark: false,
  },
};

export const theme = createSlice({
  name: "wallet",
  initialState: initialState,
  reducers: {
    updateMode: (state, action) => {
      state.value.dark = action.payload;
    },
  },
});

export const { updateMode } = theme.actions;
export default theme.reducer;
