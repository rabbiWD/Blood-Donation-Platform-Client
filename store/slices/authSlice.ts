import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser, Role } from "@/types";

export interface IAuthState {
  user: IUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  /** true once the initial session check (/auth/me) has completed */
  isHydrated: boolean;
}

const initialState: IAuthState = {
  user: null,
  role: null,
  isAuthenticated: false,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.isHydrated = true;
    },
    updateUser(state, action: PayloadAction<Partial<IUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.role = state.user.role;
      }
    },
    clearSession(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isHydrated = true;
    },
  },
});

export const { setSession, updateUser, clearSession } = authSlice.actions;
export default authSlice.reducer;
