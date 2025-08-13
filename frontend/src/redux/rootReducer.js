import { combineReducers } from "@reduxjs/toolkit";
import userdata from "./slices/userdata";

const rootReducer = combineReducers({
  studentdata: userdata,
});

export default rootReducer;
