import React from 'react';
import styled from 'styled-components';

import NLPS from '../../img/nlpjs.svg';

const Img = styled.img`
  background-color: #213583;
  position: absolute;
  margin-top: -120px;
  right: 50%;
  width: 200px;
  margin-right: -100px;
  padding: 20px;
  border-radius: 10px;
`;

export default function ButtonLogIn(props) {
  return <Img src={NLPS} />;
}
