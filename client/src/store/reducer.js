import { act } from "react-dom/test-utils";
import * as actionTypes from "./actions";

const initialState = {
  token: "",
  username: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      // return Object.assign({}, state, {
      //   token: action.payload.token,
      //   // username: action.payload.username,
      // });
      const state1 = {
        ...state,
        token: action.payload.token,
        username: action.payload.username,
      };
      console.log("STATE ", state1);
      return state1;
    default:
      return state;
  }
};

export default reducer;
