import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// 1. Immediately look for stored data upon script execution
const storedToken = localStorage.getItem("auth_token");
const storedUser = localStorage.getItem("auth_user");

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
}

const initialState: AuthState = {
  // 2. Initialize the state with the found data
  token: storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedToken, // If there's a token, they are authenticated
  isVerifying: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Ensure user data is stringified for storage
      localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
      localStorage.setItem("auth_token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // 4. Clear storage so the next refresh starts empty
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    },
    setVerifying: (state, action: PayloadAction<boolean>) => {
      state.isVerifying = action.payload;
    },
  },
});

export const { setCredentials, setVerifying, logout } = authSlice.actions;
export default authSlice.reducer;
