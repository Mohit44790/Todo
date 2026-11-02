import { combineReducers } from "@reduxjs/toolkit";
import taskReducer from "./slices/taskSlice";
import authReducer from "./slices/authSlice";

const rootReducer = combineReducers({
  tasks: taskReducer,
  auth: authReducer,
});

export default rootReducer;