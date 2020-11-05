import { createSlice } from "@reduxjs/toolkit";
import { getProfile } from "../../services/users";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    data: {},
    wallet: {
      _id: "",
      walletId: null,
      ledgerBalance: 0,
      availableBalance: 0,
      __v: 0,
    },
  },

  reducers: {
    updateWallet: (state, action) => {
      state.wallet = action.payload;
    },
    updateUser: (state, action) => {
      state.data = action.payload;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { updateWallet, updateUser } = userSlice.actions;

export const selectWallet = (state) => {
  return state.user.wallet};

export const selectProfile = (state) => state.user.data;

export const updateUserStateFromApi =  () =>  (dispatch) => {
  getProfile().then(response => {
      if (response.code === 0) {
        dispatch(updateUser(response.data));
    
        dispatch(
          updateWallet(response.data.wallet)
        );
      }
  })
};

export default userSlice.reducer;
