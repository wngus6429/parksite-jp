import { all, fork } from "redux-saga/effects";
import axios from "axios";
import postSaga from "./post";
import userSaga from "./user";
import { backUrl } from "../config/config";
//사가에서 보내는 axios 요청은 이 두개가 공통으로 들어감
axios.defaults.baseURL = backUrl; //http://localhost:3065
axios.defaults.withCredentials = true;

//우리가 만들고 싶은 비동기 액션들을 하나씩 넣어준다.
export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
//all은 배열을 받는데. 배열에 있는 것들을 한방에 실행해줌, 그러면 위에 3개가 실행되겠지
//fork는 함수를 실행시키는거임, 이게 나중에 //call이랑은 다르다, fork대신에 call 사용가능
//차이점이 있으니 나중에 상관이 있게되면 어떻게 다른지 가르쳐줌
