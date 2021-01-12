import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import Router from "next/router";
import { END } from "redux-saga";
import axios from "axios";
import useSWR from "swr";

import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
//import { backUrl } from "../config/config";

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = useSWR(
    `/user/followers?limit=${followersLimit}`,
    fetcher
  );
  const { data: followingsData, error: followingError } = useSWR(
    `/user/followings?limit=${followingsLimit}`,
    fetcher
  );
  //fetcher가 이 주소에 대해 어떻게 가져올지 ㅋ , 앞에 data, error가 없으면 로딩중
  //둘중 하나가 있으면 성공했거나 실패했거나

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);
  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    //로그인 안하면 profile페이지 못가게
    return "私の情報ローディング中";
  }
  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>Following/Follower ローディング中、エラーが発生しました。</div>;
  }

  return (
    <>
      <Head>
        <title>私のプロフィール</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList
          header="Following"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingError}
        />
        <FollowList
          header="Follower"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followerError}
        />
      </AppLayout>
    </>
  );
};

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
  context.store.dispatch(END); //next redux wrapper에 이렇게 하라고 적혀있음
  console.log("getServerSideProps end");
  await context.store.sagaTask.toPromise(); //이거는 configurestore에. sagaTask등록한거
}); //서버사이드랜더링이 request가 success될떄까지 기다려주는거

export default Profile;
