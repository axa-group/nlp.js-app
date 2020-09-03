import React from 'react';
import styled from 'styled-components';

import Logout from '../../img/logout.svg';

import { Auth } from 'aws-amplify';

const Button = styled.button`
  width: 80%;
  margin: 0 auto;
  display: block;
  background-color: #ffffff;
  margin-bottom: 30px;
  color: #213583;
  border-radius: 3px;
  line-height: 3;
`;

const Img = styled.img`
  padding: 5px;
  margin-top: -2px;
`;

export default function ButtonLogIn(props) {
    Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {

        localStorage.setItem('loggedInUser', user);
    })
    .catch(err => console.log(err));

  return (
    < Button onClick={() => { props.handleLogOut(); }} >{props.text} <Img src={Logout} /></Button>
  );
}
