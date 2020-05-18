import Request from '../request';

class AuthService {
  login(email, password) {
    return this.fetch((process.env.API_URL) + '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    }).then(response => {
      return Promise.resolve(response);
    }).catch(err => {
      Promise.reject(err);
    });
  }

  fetch(url, options) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    return Request(url, { headers, ...options });
  }
}

const authService = new AuthService();

export default authService;
