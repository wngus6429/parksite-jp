import { all, fork, delay, put, takeLatest, call } from "redux-saga/effects";
//여기안에 delay, debounce, throttle, takeLastest, takeEvery, takeMaybe 같은것도 있음
//지금 적은것들이 사가의 effect라 불림
import {
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  FOLLOW_REQUEST,
  UNFOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  CHANGE_NICKNAME_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
} from "../reducers/user";
import axios from "axios";
//이거는 컴바인 리듀스 같은게 필요 없음.

function removeFollowerAPI(data) {
  return axios.delete(`/user/follower/${data}`);
} //몇번 팔로우를 제거한다
function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowersAPI(data) {
  return axios.get("/user/followers", data);
}
function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowingsAPI(data) {
  return axios.get("/user/followings", data);
}
function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: err.response.data,
    });
  }
}

function changeNicknameAPI(data) {
  return axios.patch("/user/nickname", { nickname: data });
}
function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}

function loadMyInfoAPI() {
  return axios.get("/user");
}
function* loadMyInfo() {
  try {
    const result = yield call(loadMyInfoAPI);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

//get,delete는 데이터가 없기 떄문에, 두번째 자리가 withCredential자리, 근데
//saga에서 공통 설정 해줬음
function loadUserAPI(data) {
  return axios.get(`/user/${data}`);
}
function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_FAILURE,
      error: err.response.data,
    });
  }
}

//logInAPI이거는 generator안임. * 붙이면 안됨
function logInAPI(data) {
  return axios.post("/user/login", data); //로그인 요청 함
}

//항상 effect 앞에는 yield(일드)를 붙여준다
//call, fork차이, fork는 비동기 함수 호출, call은 동기함수 호출
//call을 하면 로그인 api가 리턴 할때까지 기다림. fork는 비동기라 요청보내버리고
//결과 안 기다리고 바로 다음으로 감, call은 await이랑 비슷

//그리고 데이터를 보낼때 logInAPI(action.data) 이렇게 해야하는데, call을 쓰면
// 이걸 펼쳐줘야함 call(logInAPI, action.data); 밑에 처럼 이렇게
//첫번쨰 자리가 함수고, 그 다음에 매개변수, 인수임 ,를 써서 더 주기 가능
//굳이 yield를 안 붙여도되지만 붙이는 이유가 테스트 때문, 동작 보장이 되는가?
function* logIn(action) {
  try {
    console.log("Saga User.js");
    const result = yield call(logInAPI, action.data); //이렇게 결과값 요청후 받음
    // yield delay(1000); //서버 만들어 질때까지 delay로 비동기 효과 주기
    yield put({
      type: LOG_IN_SUCCESS, //put은 dispatch라고 생각하면됨
      data: result.data, //성공 결과값, 성공후 reducer user.js switch로
    }); //중요한게 사가에서 자동으로 try,catch로 상황보고 석세스나
    //failure보내기 때문에 개인이 따로 액션을 할 필요가 없다
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    }); //요청이 항상 성공하는건 아니니까, try, catch 쓰면됨
  }
}
//애네들이 비동기 액션 크리에이터, thunk는 비동기 크리에이터를 직접 했지만
//Saga는 이벤트 리스너 같은 역할, 비유 하자면
//로그인 액션이 들어오면,로그인 제너레이터 함수를 실행 하도록, * 있는게 제너레이터 함수

//take는 문제가 1회성임. 로그인하고 로그아웃하면 로그인 이벤트가 사라진다는 말
//그래서 while을 사용하는거임. 이걸해야 진정한 이벤트 리스너 ㅋㅋ (원노트 참조)
//근데 반복문 적는건 좀 보기 안 좋고 더 좋은 기능인 takeEvery를 사용
//takeLatest 는 마지막에 클릭한거. (로딩 도중 기준) 여러번 클릭 방지, 첫번째꺼는 takeLeading

function logOutAPI() {
  return axios.post("/user/logout"); //로그인 요청 함
}
function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
  return axios.post("/user", data); //로그인 요청 함
} //data안에 Email, Password, NickName 가 들어있다. signup.js 참조
//get이랑 delete요청은 데이터를 못 보내지만, post,put,patch는 넘길수 있다. 두번째로
function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    //yield delay(1000); //throw new Error("")를 하게 되면 바로 밑에 catch로 간다
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
} //data에 사용자 id넣어줌
function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    //throw new Error("")를 하게 되면 바로 밑에 catch로 간다
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`); //로그인 요청 함
} //data에 사용자 id넣어줌
function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    //throw new Error("")를 하게 되면 바로 밑에 catch로 간다
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}
function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
} //로그인이라는 action이 실행될떄까지 기다리겠다.

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

//이벤트 리스너를 만드는거임
function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
} //로그인이라는 action이 실행될떄까지 기다리겠다.

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchRemoveFollower),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchChangeNickname),
    fork(watchLoadMyInfo),
    fork(watchLoadUser),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}
