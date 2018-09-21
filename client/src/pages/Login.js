import React from 'react';
import { connect } from 'react-redux';
import { withProps, compose } from 'recompose';

import { login, loadUser } from '../store';

import { push } from 'react-router-redux';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.loadUser();
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password } = this.state;
    const { login } = this.props;
    if (username && password) {
      login(username, password);
    }
  }

  render() {
    const { username, password, submitted } = this.state;
    return (
      <div>
        <h2>Login</h2>
        <form name="form" onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" value={username} onChange={this.handleChange} />
            {submitted && !username && <div>Username is required</div>}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={password} onChange={this.handleChange} />
            {submitted && !password && <div>Password is required</div>}
          </div>
          <div>
            <button>Login</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isFetching: state.user.isFetching,
    error: state.user.error
  };
};

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(loadUser()),
  login: (username, password) => dispatch(login(username, password)),
  changePage: redirect => dispatch(push(redirect))
});

const withTheme = withProps(props => ({ ...props }));

const enhance = compose(
  withTheme,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

export default enhance(Login);
