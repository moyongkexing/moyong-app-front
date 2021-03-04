import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export const profileUserSlice = createSlice({
  name: "profile_user",
  initialState: {
    profileUser: { name: "", avatar: ""}
  },
  reducers: {
    updateProfileUser: (state, action) => {
      state.profileUser.name = action.payload.name;
      state.profileUser.avatar = action.payload.avatar;
    }
  },
});

export const { updateProfileUser } = profileUserSlice.actions;
export const selectProfileUser = (state: RootState) => state.profileUser.profileUser
export default profileUserSlice.reducer;
