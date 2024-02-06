import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  registeredUser:[]
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setRegisteredUSer:(state,action) => {
      state.registeredUser = action.payload;
    },
  },
});

export const { setUser, clearUser ,setRegisteredUSer} = authSlice.actions;

export default authSlice.reducer;
