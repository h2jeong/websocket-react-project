import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '../../../store/user';

const LoginPage = ({ history }) => {
  const user = useSelector(
    ({ user }) => ({ token: user.accessToken }),
    shallowEqual
  );
  const dispatch = useDispatch();

  const STRATEGY = 'local';

  useEffect(() => {
    if (user.accessToken) history.push('/');
  }, [user.accessToken]);

  const onFinish = (values) => {
    const loginData = { ...values, strategy: STRATEGY };

    dispatch(loginUser(loginData))
      .then((res) => {
        if (res) history.push('/');
      })
      .catch((err) => {
        // console.log('login error:', err);
        alert(`로그인에 실패했습니다. ${err}`);
      });
  };

  const onFinishFailed = (errorInfo) => {
    for (let i = 0; i < errorInfo.errorFields.length; i += 1) {
      message.error(errorInfo.errorFields[i].errors[0]);
    }
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}>
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default withRouter(LoginPage);
