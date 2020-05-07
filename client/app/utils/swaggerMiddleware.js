// Based on https://github.com/noh4ck/redux-swagger-client/blob/master/src/index.js
import Swagger from 'swagger-client';
import { MISSING_API, CHECK_API, RESET_MISSING_API, LOGIN_NEEDED } from '../containers/App/constants';
import { resetMissingAPI, loadAgents, setLoginSuccess } from '../containers/App/actions';
import { push } from 'react-router-redux';

export default function swaggerMiddleware(opts) {
  let api;
  return ({ dispatch, getState }) => next => action => {

    if (!action.apiCall) {
      return next(action);
    }

    return new Swagger({
      ...opts,
      requestInterceptor(request) {
          if (request.url.includes('/api/')) {
			  const rawNlpAuth = localStorage.getItem('nlp_dashboard');
			  if (rawNlpAuth) {
				  const nlpAuth = JSON.parse(rawNlpAuth);
				  request.headers.Authorization = nlpAuth.token;
			  }
          }

          return request;
      },
      responseInterceptor(response) {
        if (response.url.includes(`${process.env.API_URL}/api/`)) {
          if (response.status === 200 && response.status < 400) {
            dispatch(setLoginSuccess());
            return response;
          } else {
            return next({ type: LOGIN_NEEDED });
          }
        } else {
          if (response.status === 200 && response.status < 400) {
            return response;
          }else{
            return next({ type: LOGIN_NEEDED });
          }
        }
      }
     }).then(result => {
          const { apiCall, ...rest } = action;
          api = result.apis;
          if (getState().global.missingAPI) {
            dispatch(resetMissingAPI());
            dispatch(loadAgents());
            dispatch(push(action.refURL));
          } else {
            return next({ ...rest, api });
          }
        },
        err => {
          if (action.type === CHECK_API) {
            return next({ type: MISSING_API });
          }
          opts.error && opts.error(err)
        }
      ).catch(err => {
        console.error(err);
        opts.error && opts.error(err);
      });
  };
}
