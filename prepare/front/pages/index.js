import React, { useEffect } from "react"; //next는 이거 없어도됨
import AppLayout from "../components/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import axios from "axios";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";

//next는 pages라는 폴더를 인식한다 그래서 그 파일을 개별적인 페이지 컴포넌트로 만들어짐

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  //메인 페이지가 나올때 바로 useEffect도 되겠지
  //Componentsdidmount 효과, 빈배열뒤에 넣으면

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          //이미 다 불러왔거나, 아니면 불러오는 중이면 더 이상 LOADPOSTREQUEST를 하지 못하게
          const lastId = mainPosts[mainPosts.length - 1]?.id; //마지막 게시글의 ID /게시글이0일때를 고려해서 ?넣어줌
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      //윈도우에서 addEvent 하면 주의해야할게 리턴을 꼭 해줘야함
      //스크롤 했던거 해제 해야함. 아니면 메모리에 쌓임
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

//서버사이드 랜더링 이부분이 알아서 home보다 먼저 실행됨. 그래야 데이터 먼저 채우고 화면이 렌더링
//매개변수 context , 여긴 프론트서버에서 실행되는거임
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log("getServerSideProps start");
  console.log("context", context);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const cookie = context.req ? context.req.headers.cookie : ""; //이걸 해야 서버쪽으로 쿠키가 전달이됨
  axios.defaults.headers.Cookie = ""; //이걸 해야 서버쪽으로 쿠키가 전달이됨
  if (context.req && cookie) {
    //서버일때랑 쿠키가 있을때 , 이런게 아니면 위에 "" //이렇게 안하면 서버에서 쿠키가 공유되서 다른사람이 내 아이디로 로그인되는
    axios.defaults.headers.Cookie = cookie;
  } //저희가 실제로 쿠키를 써서 요청을 보낼때만 잠깐 쿠키를 넣어놧다가 쿠키를 안써서 요청보낼때는 서버에서 공유하고 있는 쿠키를 제거하는 이부분이 제일 중요
  ////////////////////////////////////////////////////////////////////////////////////////
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END); //next redux wrapper에 이렇게 하라고 적혀있음
  console.log("getServerSideProps end");
  await context.store.sagaTask.toPromise(); //이거는 configurestore에. sagaTask등록한거
}); //서버사이드랜더링이 request가 success될떄까지 기다려주는거

export default Home;
