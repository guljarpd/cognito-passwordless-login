import React from 'react';
import Login from './components/Login';
import './App.css';

import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "",
    userPoolId: "",
    userPoolWebClientId: "",
    authenticationFlowType: "CUSTOM_AUTH"
  }
});

function App() {
  return (
    <div className="App">
      <h3>Cognito Login</h3>
      <Login />
    </div>
  );
}

export default App;
