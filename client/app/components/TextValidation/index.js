import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Text = styled.p`
  color: red;
  margin: 15px auto 0px auto;
`;

const TextValidation = props => <Text>{props.text}</Text>;

TextValidation.propTypes = {
  text: PropTypes.string.isRequired
};

export default TextValidation;
