// Referencing code from Module 21
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBreweries from './pages/SearchBreweries';
import SavedBreweries from './pages/SavedBreweries';
import Navbar from './components/Navbar';

import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { Layout } from 'antd';
const { Content, Footer } = Layout;

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <br />
          <br />
          <Content style={{ height: 100 + '%' }}>
            <Switch>
              <Route exact path='/' component={SearchBreweries} />
              <Route exact path='/saved' component={SavedBreweries} />
              <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
            </Switch>
            <br />
            <br />
            <br />
          </Content>
          {/* Sticky footer: https://www.w3schools.com/howto/howto_css_fixed_footer.asp */}
          <Footer
            className='brown-bg white-text'
            style={{
              position: 'fixed',
              bottom: 0,
              width: '100%',
              height: '4rem',
              textAlign: 'center',
              paddingTop: '20px',
            }}
          >
            Tap Map © 2022
          </Footer>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
