import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface IUiState {
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
}

const initialState: IUiState = {
  sidebarOpen: true,
  mobileNavOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setMobileNavOpen } =
  uiSlice.actions;
export default uiSlice.reducer;
