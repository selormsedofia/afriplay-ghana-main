import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    isAuthenticated: false,
    token: null,
  },

  reducers: {}
})

export default authSlice.reducer;
export const { } = authSlice.actions

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     email: "",
//     error: false,
//     loading: false
//   },

  // reducers: {
  //   generateOTP_begin: (state) => {
  //     state.loading = true;
  //     state.error = false;
  //   },
  //   generateOTP_success: (state, action) => {
  //     state.email = action.payload;
  //     state.loading = false;
  //     // I set email in local storage so that even if user refreshes OTPpage
  //     // the data ll remain in state and he doesnt need to re-enter email address
  //     localStorage.setItem("afri_email", action.payload.email);
  //     localStorage.setItem("afri_mobile_number", action.payload.mobileNumber);
  //   },
  //   generateOTP_error: (state) => {
  //     state.loading = false;
  //     state.error = true;
  //   },
  //   validateOTP_begin: (state) => {
  //     state.loading = true;
  //     state.error = false;
  //   },
  //   validateOTP_success: (state, action) => {
  //     state.email = action.payload;
  //     state.loading = false;
  //     // I remove users email from localStorage after OTP is successfull
  //     // localStorage.removeItem("email");
  //   },
  //   validateOTP_error: (state) => {
  //     state.loading = false;
  //     state.error = true;
  //   },
  //   loginUser_statrt: (state) => { }
  // }
// });


// export const {
//   generateOTP_begin,
//   generateOTP_success,
//   generateOTP_error,
//   validateOTP_begin,
//   validateOTP_success,
//   validateOTP_error
// } = authSlice.actions;
