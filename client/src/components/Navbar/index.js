// Referencing code from Module 21
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from '../SignupForm';
import LoginForm from '../LoginForm';
import Auth from '../../utils/auth';
import { Menu, Modal, Layout, Tabs } from 'antd';
import './style.css';
const { Header } = Layout;


const AppNavbar = () => {
  // set modal display state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // consider adding icons: https://ant.design/components/menu
  const menuItems = [
    {
      label: (
        <Link to='/' className='logo white-link'>
          TAP MAP <i className="fa-brands fa-untappd"></i>
        </Link>
      ),
      key: 'logo',
    },
    {
      label: (
        <a 
          href='https://donate.stripe.com/test_aEU8xxfHB49p4Sc7ss' 
          target='_blank' 
          rel='noopener noreferrer'
          className='white-link'
        >
          Donate
        </a>
      ),
      key: 'donate',
    },
    {
      label: (
        <Link to='/' className='white-link'>
            Search For Breweries
        </Link>
      ),
      key: 'search',
    },
    {
      label: (Auth.loggedIn() ? (
          <Link to='/saved' className='white-text'>
            Your Saved Breweries
          </Link>
        ) : (
          <p className='faded-text'>Your Saved Breweries</p>
        )
      ),
      key: 'saved',
    },
    {
      label: (Auth.loggedIn() ? (
          <p className='white-text' key='logout' onClick={Auth.logout}>
            Logout
          </p>
        ) : ( 
          <a href='#' className='white-link' onClick={showModal}>
            Login/Signup
          </a>
        )
      ),
      key: 'auth',
    },
  ];

  return (
    <Layout className='layout brown-bg'>
      <Header
        style={{
          position: 'fixed',
          zIndex: 999,
          top: 0,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Menu 
          mode='horizontal' 
          defaultSelectedKeys={['menuItems']} 
          items={menuItems} 
          className='header-bg'
        />
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          aria-labelledby='signup-modal'
          footer={[]}
        >
          {/* tab container to do either signup or login component */}
          <Tabs>
            <Tabs.TabPane tab='Login' key='login' className='login-tab'>
              <LoginForm handleModalClose={handleCancel} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Signup' key='signup' className='signin-tab'>
              <SignUpForm handleModalClose={handleCancel} />
            </Tabs.TabPane>
          </Tabs>
        </Modal>
        {/* set modal data up */}
      </Header>  
    </Layout>
  );
};

export default AppNavbar;
