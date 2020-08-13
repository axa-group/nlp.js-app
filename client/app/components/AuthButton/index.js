import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  width: 100%;
  margin: 0 auto;
  display: block;
  font-size: 20px;
  padding: 15px;
  background-color: #213583;
  margin-top: 45px;
  color: #ffffff;
  transition: 0.3s;
  border-radius: 3px;
`;

export default function ButtonLogIn(props) {
  return (
    <Button
      onClick={() => {
        console.log("ButtonLogIn(): validating credentials...");

        props.validateForm();
      }}
    >
      {props.text}
    </Button>
  );
}
