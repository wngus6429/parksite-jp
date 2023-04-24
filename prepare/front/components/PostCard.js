import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Popover, Avatar, List, Comment } from 'antd';
import { RetweetOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import Link from 'next/link';
import moment from 'moment';
import { LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST, UPDATE_POST_REQUEST } from '../reducers/post';
import FollowButton from './FollowButton';

moment.locale('ja');

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const id = useSelector((state) => state.user.me?.id);
  const [editMode, setEditMode] = useState(false);
  //me.id가 있으면 그 데이터가 들어가고 없으면 undefined
  //옵셔널 체이닝 연산자라고 한다. optional chaining
  const onClickUpdate = useCallback(() => {
    setEditMode(true);
  }, []);
  const onCancelUpdate = useCallback(() => {
    setEditMode(false);
  }, []);
  const onChangePost = useCallback(
    (editText) => () => {
      dispatch({
        type: UPDATE_POST_REQUEST,
        data: {
          PostId: post.id,
          content: editText,
        },
      });
    },
    [post]
  );

  const onLike = useCallback(() => {
    if (!id) {
      return alert('ログインが必要です。');
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);
  const onUnlike = useCallback(() => {
    if (!id) {
      return alert('ログインが必要です。');
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);
  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('ログインが必要です。');
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);
  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev); //이렇게 하면 true는 false로 false는 true로 함
  }, []);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('ログインが必要です。');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  const liked = post.Likers.find((v) => v.id === id);
  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key='retweet' onClick={onRetweet} />,
          liked ? <HeartTwoTone twoToneColor='#eb2f96' key='heart' onClick={onUnlike} /> : <HeartOutlined key='heart' onClick={onLike} />,
          <MessageOutlined key='comment' onClick={onToggleComment} />,
          <Popover
            key='more'
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    {!post.RetweetId && <Button onClick={onClickUpdate}>修正</Button>}
                    <Button type='danger' loading={removePostLoading} onClick={onRemovePost}>
                      削除
                    </Button>
                  </>
                ) : (
                  <Button>申告</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname}様がRetweetしました。` : null}
        extra={id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet ? (
          <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
            <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`} prefetch={false}>
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} onChangePost={onChangePost} onCancelUpdate={onCancelUpdate} />}
            />
          </Card>
        ) : (
          <>
            <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
            <Card.Meta
              avatar={
                //아바타누르면 그 사람이 쓴 글 볼수 있게
                <Link href={`/user/${post.User.id}`} prefetch={false}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.User.nickname}
              description={
                <PostCardContent editMode={editMode} onChangePost={onChangePost} onCancelUpdate={onCancelUpdate} postData={post.content} />
              }
            />
          </>
        )}
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}個の コメント`}
            itemLayout='horizontal'
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link href={`/user/${item.User.id}`} prefetch={false}>
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
