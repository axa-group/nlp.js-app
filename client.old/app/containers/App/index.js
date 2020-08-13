import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { push } from 'react-router-redux';

import NavSideBar from '../../components/NavSideBar';
import withProgressBar from '../../components/ProgressBar';
import { checkAPI, loadSettings, setLoginNeeded } from '../../containers/App/actions';
import {
  makeSelectAgents,
  makeSelectError,
  makeSelectLoading,
  makeSelectMissingAPI,
  makeSelectLoginStatus
} from '../../containers/App/selectors';
import ConversationBar from '../ConversationBar';
import Login from '../Login';

// import normalizeCSS from 'stylesheets/normalize-min.css';

export class App extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
    this.props.onLoadSettings();
    this.props.onCheckAPI();
  }

  componentDidMount(){
    if (this.props.missingAPI){
      this.props.onMissingAPI(this.props.router.location.pathname);
    }
  }

  componentWillUpdate(){
    this.props.onCheckAPI(this.props.router.location.pathname);
  }

  componentDidUpdate(){
    if (this.props.missingAPI){
      this.props.onMissingAPI(this.props.router.location.pathname);
    }
  }

  render() {
    const { children, isLoginSuccess } = this.props;
    return (
      <div>
        {isLoginSuccess ? 
          (<div>
            <Alert stack={false} timeout={3000} />
            <NavSideBar />
            <main className="group" role="main">
              {React.Children.toArray(children)}
            </main>
            <ConversationBar />
          </div>)
        : <Login />}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
  agents: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onComponentMounting: React.PropTypes.func,
  onMissingAPI: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onFailedCredentials: () => {
      dispatch(setLoginNeeded());
    },
    onMissingAPI: (refURL) => {
      if (refURL !== '/missing-api'){
        dispatch(push('/missing-api'));
      }
    },
    onCheckAPI: (refURL) => {
      if (refURL && refURL !== '/missing-api'){
        dispatch(checkAPI(refURL));
      }
      dispatch(checkAPI());
    },
    onLoadSettings: () => {
      dispatch(loadSettings());
    }
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agents: makeSelectAgents(),
  missingAPI: makeSelectMissingAPI(),
  isLoginSuccess: makeSelectLoginStatus(),
});

export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));

