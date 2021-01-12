import styled, { createGlobalStyle } from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
//스타일은 중요한 부분이 아니기에 여기다 모음
//거기에 export 했으니 다른데서 쉽게 가져다 쓸수 있음

//함수는 func`` 백틱 두개로 호출 할수도 있다
//밑에 styled.div``은 함수ㅋㅋ

//react-slick은 기본 세팅 CSS 값이 있는데 그걸 덮어씌워야함
//antd 에 webkit-transform, transform 때문에 전체 화면이 안되는거임
//transform 안에다가 fixed가 들어가면, fixed를 제대로 못 잡음
export const Global = createGlobalStyle`
  .slick-slide{
  display:inline-block;
  }
  .ant-card-cover {
    transform:none !important;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  z-index: 5000; //이건 자바스크립트 문법임
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Header = styled.header`
  height: 44px;
  background: white;
  position: relative;
  padding: 0;
  text-align: center;
  //&는 안에라는 뜻임
  & h1 {
    margin: 0;
    font-size: 17px;
    color: #333;
    line-height: 44px;
  }
`;

export const CloseBtn = styled(CloseOutlined)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 15px;
  line-height: 14px;
  cursor: pointer;
`;

export const SlickWrapper = styled.div`
  height: calc(100% - 44px);
  background: #090909;
`;

export const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;

  &img {
    margin: 0 auto;
    max-height: 750px;
  }
`;

//복수의 사진 중에서 몇번째거를 보고 있는지 판별
export const Indicator = styled.div`
  text-align: center;
  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;
