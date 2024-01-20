import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    mintedBlocks: [],
  },
};

export const blocks = createSlice({
  name: "wallet",
  initialState: initialState,
  reducers: {
    setMintedBlocks: (state, action) => {
      state.value.mintedBlocks = action.payload;
    },
    pushMintBlock: (state, action) => {
      state.value.mintedBlocks.push(action.payload);
    },
    removeBlock: (state, action) => {
      state.value.mintedBlocks = state.value.mintedBlocks.filter(
        (block) => block.blockNumber != action.payload.blockNumber
      );
    },
    removeBlocks: (state, action) => {
      state.value.mintedBlocks = state.value.mintedBlocks.filter(
        (block) =>
          action.payload.filter(
            (removeBlock) => removeBlock.blockNumber == block.Number
          ).length == 0
      );
    },
  },
});

export const { setMintedBlocks, pushMintBlock, removeBlock, removeBlocks } =
  blocks.actions;
export default blocks.reducer;
