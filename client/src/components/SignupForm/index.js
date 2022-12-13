// Referencing code from Module 21
import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';

import Auth from '../../utils/auth';

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
  },
};

const SignupForm = () => {
  // set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });

  const [addUser] = useMutation(ADD_USER);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
  };


  // update state based on form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // submit form
    // referencing this link for ant design forms: https://annacoding.com/article/62fqzseKsAO9ON7dhTCnAC/Submit-Form-of-Ant-Design-V4-with-Submit-Button-out-of-Form-in-React-Hooks 
  const handleFormSubmit = async () => {
    await form.validateFields()
      .then(async (values) => {
        try {
          const { data } = await addUser({ variables: { username: values.username, email: values.email, password: values.password } });
          
          Auth.login(data.addUser.token);
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
      <Form form={form} onFinish={onFinish} validateMessages={validateMessages}>
      <Form.Item
          label='Username'
          name='username'
          rules={[
            {
              required: true,
            },
          ]}
          onChange={handleInputChange}
          value={userFormData.username}
        >
          <Input />
        </Form.Item>
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
          // disabled={!(userFormData.email && userFormData.password)}
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

export default SignupForm;
