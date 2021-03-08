import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '../../../store/user';

const LoginPage = ({ history }) => {
  const dispatch = useDispatch();

  const token = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')).token
    : null;
  const STRATEGY = 'local';

  useEffect(() => {
    if (token) history.push('/');
  }, [token]);

  const onFinish = (values) => {
    const loginData = { ...values, strategy: STRATEGY };

    dispatch(loginUser(loginData))
      .then((res) => {
        const { user, accessToken } = res.payload;

        localStorage.setItem(
          'userInfo',
          JSON.stringify({
            id: user.id,
            token: accessToken,
            projects: user.projects
          })
        );
        history.push('/');
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
