import React from 'react';
import styled from 'styled-components';

import Logout from '../../img/logout.svg';

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
  return (
    <Button
      onClick={() => {
        props.handleLogOut();
      }}
    >
      {props.text} <Img src={Logout} />
    </Button>
  );
}
