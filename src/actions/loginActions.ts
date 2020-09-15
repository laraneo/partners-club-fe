import Auth from '../api/Auth';
import AXIOS from '../config/Axios'
import SecureStorage from '../config/SecureStorage'
import snackBarUpdate from '../actions/snackBarActions';
import { ACTIONS } from '../interfaces/actionTypes/loginTypes';
import _ from 'lodash';

import { mainStatusLoading } from '../actions/loadingMainActions';
// import history from '../config/History';

const attempts = window.attempts;


export const login = (body: object) => async (dispatch: Function) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true })
    try {
        const {
            data,
            status
        } = await Auth.login(body);
        let authResponse: any = [];
        if (status === 200 || status === 201) {
            authResponse = {
                data,
                status
            };
            const { token, user } = data;
            const role = _.first(user.roles);
            SecureStorage.setItem('token', token);
            dispatch({ type: ACTIONS.SET_LOADING, payload: { ...user, role } })
        }
        return authResponse;
    } catch (error) {
        let title = ''
        if (error.response) {
            const { status, data: { message } } = error.response
            if (status === 401) {
                title = message
            }
        }
        snackBarUpdate({
            payload: {
                message: title,
                status: true,
                type: 'error',
            },
        })(dispatch);
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
        throw error;
    }
};

export const logout = () => ({ type: ACTIONS.LOGOUT })

export const checkLogin = (count: number = 0) => async (dispatch: Function) => {
    dispatch(mainStatusLoading(true))
    try {
        const {
            data: { data },
            status
        } = await Auth.checkLogin();
        let checkLoginResponse = [];
        if (status === 200) {
            checkLoginResponse = data;
            const role = _.first(data.roles);
            dispatch({ type: ACTIONS.SET_USER, payload: { ...data, role } })
            dispatch(mainStatusLoading(false))
        }
        return checkLoginResponse;
    } catch (error) {
        if(count <= attempts) {
            let counter = count + 1;
            dispatch(checkLogin(counter));
          } else {
            snackBarUpdate({
              payload: {
                message: error.message,
                status: true,
                type: "error",
              },
            })(dispatch);
          }
        dispatch(mainStatusLoading(false))
        return error;
    }
};

export function setupInterceptors() {
      AXIOS.interceptors.response.use(
        response => {
          return response;
        },
        error => {
        if (error.response && error.response.status === 401) {
            // if(history.location.hash !== '' && history.location.hash !== '#/' && error.response.data.message === "Unauthenticated.") {
            //     window.location.href = '/';
            // }
          }
          return Promise.reject(error);
        },
      );
  }
  
