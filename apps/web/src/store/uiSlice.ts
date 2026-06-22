import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';

/** Global, ephemeral UI state — currently just the nav drawer's open flag. */
interface UiState {
  sidebarOpen: boolean;
}

const initialState: UiState = { sidebarOpen: false };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
  },
});

export const { openSidebar, closeSidebar } = uiSlice.actions;

export default uiSlice.reducer;

// ---- Selectors ----
export const selectSidebarOpen = (s: RootState) => s.ui.sidebarOpen;
