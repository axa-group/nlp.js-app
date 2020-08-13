import Request from '../request';
import {Auth} from 'aws-amplify';

class AuthService {
    async signIn() {
        try {
            const user = await Auth.signIn(username, password);
        } catch (error) {
            console.log('error signing in', error);
        }

    } // signIn()

  logout() {
    console.log("AuthService: logout(): logging out current user...")
  }

  login(email, password) {
    console.log("Auth.service: logging in user " + email + "... ");

    var user;

    // login with Cognito API
    try {
        user = Auth.signIn(email, password);
    } catch (error) {
        console.log('error signing in', error);
    }

    // return the Cognito user object
    return(Promise.resolve(user));

  } // login()

  fetch(url, options) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    return Request(url, { headers, ...options });
  }


} // class AuthService

const authService = new AuthService();

export default authService;
