import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface USER {
  displayName: string;
  photoUrl: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {uid: "", photoUrl: "", displayName: ""},
    showUser: { name: "", avatar: ""}
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = {uid: "", photoUrl: "", displayName: ""};
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    },
    setShowUser: (state,action) => {
      state.showUser = action.payload;
    }
  },
});

export const { login, logout, updateUserProfile, setShowUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user
export const selectShowUser = (state: RootState) => state.user.showUser
export default userSlice.reducer;
