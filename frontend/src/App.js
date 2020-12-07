import React from 'react';
import './App.css';
import Routes from "./components/Routes"
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient( {
  uri: 'http://localhost:3001/graphql'
} );

function App () {

  return (
    <div>
      <ApolloProvider client={ client }>
        <BrowserRouter>
          <Routes></Routes>
        </BrowserRouter>
      </ApolloProvider>
    </div>
  );
}

export default App;
