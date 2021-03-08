import React from 'react';
import { Comment, Avatar, Tooltip } from 'antd';
import moment from 'moment';

const ChatCard = ({ chat }) => {
  const { sender, text, date } = chat;

  return (
    <div className="message">
      <Comment
        author={sender.id}
        avatar={<Avatar src={sender.imageUrl} alt={sender.id} />}
        content={text}
        datetime={
          <Tooltip title={moment(date).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(date).fromNow()}</span>
          </Tooltip>
        }
      />
    </div>
  );
};

export default ChatCard;
