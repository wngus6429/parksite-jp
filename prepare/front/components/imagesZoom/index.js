import React, { useState } from "react";
import PropTypes from "prop-types";
import Slick from "react-slick";
import { Overlay, Global, Header, CloseBtn, ImgWrapper, Indicator, SlickWrapper } from "./styles";
//import { backUrl } from "../../config/config";

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setcurrentSlide] = useState(0);
  return (
    <Overlay>
      <Global />
      <Header>
        <h1>詳細イメージ</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            afterChange={(slide) => setcurrentSlide(slide)}
            infinite
            arrows={true}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img
                  style={{ maxHeight: "600px" }}
                  src={`${v.src.replace(/\/thumb\//, "/original/")}`}
                  alt={v.src}
                />
              </ImgWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1}
              {""}/{images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};
ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
//initialSlide={0}첫번쨰 사진은 무엇으로
//afterChange={(slide) => setcurrentSlide} 페이지를 넘길때 마다 번호를줌
//infinite는 끝에서 더 넘기면 처음걸로감 , arrow는 화살표 사라짐, 무조건 클릭해서 넘겨야함

//스타일은 중요한 부분이 아니기에 styles.js에서 받아 오는걸로 하는거
//거기에 export 했으니 다른데서 쉽게 가져다 쓸수 있음
//이건 제일 중요한 로직이니 index.js 로 한것
