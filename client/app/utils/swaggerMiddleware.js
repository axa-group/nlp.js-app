// Based on https://github.com/noh4ck/redux-swagger-client/blob/master/src/index.js
import Swagger from 'swagger-client';
import { MISSING_API, CHECK_API, RESET_MISSING_API, LOGIN_NEEDED } from '../containers/App/constants';
import { resetMissingAPI, loadAgents, setLoginSuccess } from '../containers/App/actions';
import { push } from 'react-router-redux';
import {Auth} from 'aws-amplify';

export default function swaggerMiddleware(opts) {
  let api;

  return ({ dispatch, getState }) => next => action => {

    if (!action.apiCall) {
      return next(action);
    }

    return new Swagger({
      ...opts,
      requestInterceptor(request) {
         console.log("(swaggermiddleware) localstorage username: ", localStorage.getItem('username'));
         console.log("(swaggermiddleware) localstorage id_token: ", localStorage.getItem('id_token'));

        // API Gateway will use the Cognito Authorizer to validate the token
        // API Gateway: use no OAuth scopes; use id_token

        console.log("(swaggermiddleware) request.url: ", request.url);

        if (request.url.includes('/api/')) {
            request.headers['Authorization']="Bearer " + localStorage.getItem('id_token');
            request.headers['Content-Type']='text/plain';
            request.headers['Content-Length']='356';
            request.headers['Host']='*';
//            request.headers['User-Agent']='training_app';
            request.headers['Accept']='*/*';
            request.headers['Accept-Encoding']='gzip, deflate, tar';
            request.headers['Connection']='keep-alive';

            console.log("***** new request: ", JSON.stringify(request));

        } // if request.url.includes()

        return request;
      }, // requestInterceptor
      responseInterceptor(response) {
//        console.log("responseInterceptor: " + JSON.stringify(response));

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
