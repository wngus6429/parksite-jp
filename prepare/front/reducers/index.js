import { HYDRATE } from "next-redux-wrapper"; //리덕스 서버사이드랜더링을 위해 하이드레이트 사용
import { combineReducers } from "redux";
import user from "./user";
import post from "./post";

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
