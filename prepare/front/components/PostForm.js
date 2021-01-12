import React, { useCallback, useRef, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addPost, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST } from "../reducers/post";
import useinput from "../hooks/useinput";
//import { backUrl } from "../config/config";

const PostForm = () => {
  const dispatch = useDispatch();
  const { imagePaths, addPostLoading, addPostDone } = useSelector((state) => state.post);
  const [text, onChangeText, setText] = useinput("");

  useEffect(() => {
    if (addPostDone) {
      setText("");
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert("投稿を作成してください。");
    }
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append("image", p); //key가 image / req.body.image
    });
    formData.append("content", text); //key가 content / req.body.content
    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log("images", e.target.files); //여기안에 이미지 파일 정보가 들어있음
    const imageFormData = new FormData(); //이미지를 multipart로 안 올리면 multer가 처리를 안함
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append("image", f); //앞에 image는 키다 router에서 image 문자일치 해야함
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });
  return (
    //encType="multipart/form-data" 이거는 이미지 올리면 이 형식으로 올라간다고
    //밑에 imageInput에서 전달된게 upload.array로 전달이 된다
    <Form style={{ margin: "10px 0 20px" }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="どんな事件がありましたか。"
      />
      <div>
        <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>イメージアップロード</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          投稿
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img src={v.replace(/\/thumb\//, "/original/")} style={{ width: "200px" }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>削除</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;

//hidden은 밑에 다른 Button (이미지 삽입) 을 사용하기 위해서 안보이게 한것
