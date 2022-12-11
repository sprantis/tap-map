// Referencing code from Module 21
// see SignupForm.js for comments
import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations';

import Auth from '../../utils/auth';

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
  },
};

const LoginForm = () => {
  // set initial form state
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });

  const [loginUser] = useMutation(LOGIN_USER);

  const [form] = Form.useForm();

  // Part of Ant Design form
  const onFinish = (values) => {
    console.log('VALUES: ' + JSON.stringify(values));
  };

  // update state based on form input changes
  const handleInputChange = (event) => {
    // console.log('EVENT.TARGET.VALUE: ' + event.target.value);
    // console.log('EVENT.TARGET: ' + JSON.Stringify(event.name));
    // console.log('USERFORMDATA: ' + JSON.stringify(userFormData));
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // submit form
  // referencing this link for ant design forms: https://annacoding.com/article/62fqzseKsAO9ON7dhTCnAC/Submit-Form-of-Ant-Design-V4-with-Submit-Button-out-of-Form-in-React-Hooks 
  const handleFormSubmit = async () => {
    await form.validateFields()
      .then(async (values) => {
        try {
          const { data } = await loginUser({ variables: { email: values.email, password: values.password } });
          // console.log('VALUES: ' + values);
          Auth.login(data.login.token);
        } catch (err) {
          // add alert here
          console.error(err);
        }
      })

    // clear form values
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form 
        form={form}
        onFinish={onFinish}
        validateMessages={validateMessages}>
        {/* name prop needs to be present for handleOnChange to work */}
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              type: 'email',
            },
          ]}
          onChange={handleInputChange}
          value={userFormData.email}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
            },
          ]}
          onChange={handleInputChange}
          value={userFormData.password}
        >
          <Input />
        </Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          onClick={handleFormSubmit}
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
