import React, { Component } from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import Input from '../../components/Input';
import Button from '../../components/AuthButton';
import Img from '../../components/AuthImage';
import TextValidation from '../../components/TextValidation';

import AuthService from '../../utils/auth/auth.service';
import { setLoginSuccess, loadAgents } from '../App/actions'
import { makeSelectLoginStatus } from '../App/selectors'

const Wrapper = styled.div`
  background-color: #f7f7f7;
  border-radius: 3px;
  width: 500px;
  margin: 0 auto;
  margin-top: 150px;
  box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.25);
  padding: 80px;
`;

const Container = styled.section`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: 1;
`;

const Nav = styled.div`
  float: left;
  position: fixed;
  width: 200px;
  margin-left: -200px;
  height: 100vh;
  background-color: #ffffff;
`;

const prefix = process.env.PUBLIC_PATH_PREFIX;

export class Auth extends Component {
  state = {
    email: '',
    password: '',
    hasValidEmail: true,
    hasValidPassword: true,
    wrongCredentials: false
  };

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  validateForm = () => {
    let { email, password } = this.state;
    const hasValidPassword = !!password;
    const hasValidEmail = !!email;

    this.setState({
      hasValidEmail,
      hasValidPassword
    });

    if (hasValidPassword && hasValidEmail) {
      AuthService.login(email, password)
        .then(response => {
          if (!response) {
            return this.setState({ wrongCredentials: true });
          }
          console.log('login response', response);
          localStorage.setItem('nlp_dashboard', JSON.stringify(response));
          this.props.onLoadAgents();
          this.props.onLoginSuccess();
          browserHistory.push(`${prefix}/`);
        })
        .catch(error => {
          console.error(error);
					this.setState({ wrongCredentials: true });
        });
    }
  };

	keyPressed = (event) => {
		if (event.key === 'Enter') {
			this.validateForm();
		}
	};

  render() {
    const { email, password, hasValidPassword, hasValidEmail, wrongCredentials } = this.state;
    let hasValidPasswordContainer;
    let hasValidEmailContainer;
    let textCredentials;

    if (wrongCredentials) {
      textCredentials = <TextValidation text="Wrong Credentials" />;
    }

    if (!hasValidPassword) {
      hasValidPasswordContainer = <TextValidation text="Please introduce a password" />;
    }

    if (!hasValidEmail) {
      hasValidEmailContainer = <TextValidation text="Please introduce a email" />;
    }

    return (
      <Container>
        <Nav />
        <Wrapper>
          <Img />
          <Input
            value={email}
            handleInputChange={this.handleInputChange}
            placeholder="Email"
            name="email"
            type="text"
          />
          {hasValidEmailContainer}
          <Input
            value={password}
						onKeyPress={this.keyPressed}
            handleInputChange={this.handleInputChange}
            placeholder="Password"
            name="password"
            type="password"
          />
          {hasValidPasswordContainer}
          <Button validateForm={this.validateForm} text="Login" />
          {textCredentials}
        </Wrapper>
      </Container>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
		onLoginSuccess: () => dispatch(setLoginSuccess()),
    onLoadAgents: () => dispatch(loadAgents())
  };
}

const mapStateToProps = createStructuredSelector({
  isLoginSuccess: makeSelectLoginStatus()
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
