import React, { useCallback, useMemo } from "react";
import { Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import useinput from "../hooks/useinput";
import { CHANGE_NICKNAME_REQUEST } from "../reducers/user";

const NicknameEditForm = () => {
  const { me } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useinput(me?.nickname || "");
  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);

  const style = useMemo(() => ({ marginBottom: "20px", border: "1px solid #d9d9d9", padding: "30px" }));
  return (
    <Form style={style}>
      <Input.Search
        value={nickname}
        onChange={onChangeNickname}
        addonBefore="ニックネーム"
        enterButton="修正"
        onSearch={onSubmit}
      />
    </Form>
  );
};

export default NicknameEditForm;
//onSearch={onSubmit} antd만의 좀 특별한거 공식문서 확인
