import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const InputLogin = styled.input`
  && {
    width: 250px;
    height: 20px;
    margin: 0 auto;
    display: block;
    padding: 10px;
    font-size: 1.2em !important;
    margin-top: 30px;
    background-image: linear-gradient(to bottom, #223881, #223881),
      linear-gradient(to bottom, silver, silver);
    background-size: 0 2px, 100% 1px;
    background-position: 50% 100%;
    transition: background-size 0.4s cubic-bezier(0.64, 0.09, 0.08, 1);
    box-shadow: none;
    border: none;
  }
  &&:focus {
    box-shadow: none !important;
    border: none !important;
    background-size: 100% 2px, 100% 1px;
    outline: none;
    &::placeholder {
      transform: translateX(20px);
      opacity: 0;
      transition: all 0.5s ease;
    }
  }
`;

const Input = props => {
  return (
    <InputLogin
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
			onKeyPress={props.onKeyPress}
      onChange={event => props.handleInputChange(event)}
    />
  );
};

InputLogin.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default Input;