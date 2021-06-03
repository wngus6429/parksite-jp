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
import { Card } from "antd";
const { Meta } = Card;
const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

//gutter 같은거 넣어서 밑에 작은 스크롤이 생겨서 없앨려고
const Global = createGlobalStyle`
body {
background: url("./back2.jpg");
background-size: cover;
background-repeat: repeat;
}
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
          <img src="./react.jpg" width="100%" height="200px" />
          <img src="./next.png" width="100%" height="200px" />
          <img src="./secal.png" width="100%" height="200px" />
          <img src="./AWS.png" width="100%" height="200px" />
        </Col>
        <Col xs={24} md={13}>
          {children}
        </Col>
        <Col xs={24} md={5}>
          <a href="https://wngus6429.github.io/NewPortFolio/" target="_blank" rel="noopener noreferrer">
            <Card hoverable style={{ width: 380 }} cover={<img alt="example" src="./study.jpg" />}>
              <Meta title="Park PortFolio" description="https://wngus6429.github.io/NewPortFolio/" />
            </Card>
          </a>
          <a href="https://github.com/wngus6429/parksite-jp" target="_blank" rel="noopener noreferrer">
            <Card hoverable style={{ width: 380 }} cover={<img alt="example" src="./git.jpg" />}>
              <Meta title="Source" description="https://github.com/wngus6429/parksite-jp" />
            </Card>
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: Proptypes.node.isRequired,
};

export default AppLayout;

// target="_blank" rel="noopener noreferrer" 보안관련
