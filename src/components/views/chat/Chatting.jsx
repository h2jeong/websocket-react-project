import React, { useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { MessageOutlined, EnterOutlined } from '@ant-design/icons';
import ChatCard from './ChatCard';

const Chatting = ({ recipientId }) => {
  const user = useSelector((state) => state.user);
  const socket = useSelector((state) => state.socket, shallowEqual);
  const chats = useSelector((state) => state.chat.chats, shallowEqual);
  const [msg, setMsg] = useState('');

  const UserImage = `http://gravatar.com/avatar/${moment().unix()}?d=identicon`;

  /* Load previous chat list - Server development required */
  // useEffect(() => {
  //   dispatch(getChats());
  // }, []);

  function waitForSocketConnection(socket, callback) {
    setTimeout(() => {
      if (socket.readyState === 1) {
        console.log('Connection is made');
        if (callback != null) {
          callback();
        }
      } else {
        console.log('wait for connection...');
        waitForSocketConnection(socket, callback);
      }
    }, 5); // wait 5 milisecond for the connection...
  }

  function sendMessage(e) {
    e.preventDefault();

    if (!msg) {
      message.info('Type the input message.');
      return;
    }
    const chatMsg = {
      type: 'message',
      msg_type: 'chat',
      sender: { id: user.user.id, imageUrl: UserImage },
      recipient: recipientId,
      text: msg,
      date: moment()
    };
    // console.log('socket', socket.socket);
    if (!socket.socket) {
      message.info('Socket is closed. Refresh the page.', 5);
      return;
    }

    waitForSocketConnection(socket.socket, () => {
      console.log('msg sent!!!');
      socket.socket.send(JSON.stringify(chatMsg));
      setMsg('');
    });
  }

  const scrollTo = (ref) => {
    if (ref /* + other conditions */) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  let idx = 0;
  /* eslint-disable no-plusplus */
  const renderChats = () =>
    chats?.map((c) => <ChatCard key={idx++} chat={c} />);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        <div
          className="infinite-container"
          style={{ height: '400px', overflowY: 'scroll' }}>
          {chats && renderChats()}
          <div ref={scrollTo} style={{ float: 'left', clear: 'both' }} />
        </div>
        <Row>
          <Form
            layout="inline"
            style={{ width: '100%' }}
            onSubmit={sendMessage}>
            <Col span={20}>
              <Input
                id="message"
                prefix={
                  <MessageOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Let's start talking"
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                style={{ width: '100%' }}
                onClick={sendMessage}
                htmlType="submit">
                <EnterOutlined />
              </Button>
            </Col>
          </Form>
        </Row>
      </div>
    </div>
  );
};

export default Chatting;
