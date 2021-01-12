import React, { useCallback } from "react"; //없어도됨
import Proptypes from "prop-types";
import Link from "next/link"; //next 자체적 라우터
import { Menu, Input, Row, Col } from "antd";
import "antd/dist/antd.css";
import styled from "styled-components";
import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";
import { useSelector } from "react-redux"; //리액트랑 리덕스 연결
import Router from "next/router"; //프로그래밍적으로 주소를 옮길떄는 router사용
import { createGlobalStyle } from "styled-components";
import useinput from "../hooks/useinput";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

//gutter 같은거 넣어서 밑에 작은 스크롤이 생겨서 없앨려고
const Global = createGlobalStyle`
.ant-row{
  margin-left:0 !important;
  margin-right:0 !important;
}
.ant-col:first-child{
  padding-left:0 !important;
}
.ant-col:last-child{
  padding-right:0 !important;
}
`;

const AppLayout = ({ children }) => {
  //const [isLoggedIn, setIsLoggedIn] = useState(false); //리덕스가 있어서
  const { me } = useSelector((state) => state.user); //isLoggedIn이 바뀌면 알아서 applayout이 리랜더링
  // const { isLoggedIn } = useSelector((state) => state.user); //구조분해 할당방법, 성능차이 쬐금 남
  const [searchInput, onChangeSearchInput] = useinput("");

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);
  return (
    <div>
      <Global />
      <Menu theme="dark" mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>ホーム画面</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>プロフィール</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton value={searchInput} onChange={onChangeSearchInput} onSearch={onSearch} />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a href="https://wngus6429.github.io/NewPortFolio/" target="_blank" rel="noopener noreferrer">
            ポートフォリオ
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: Proptypes.node.isRequired, //리액트의 node
};

export default AppLayout;

// target="_blank" rel="noopener noreferrer" 보안관련
