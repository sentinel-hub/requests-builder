import React, { useEffect } from 'react';
import ClientOAuth2 from 'client-oauth2';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  getTokenFromLocalStorage,
  decodeToken,
  saveTokenToLocalStorage,
  removeTokenFromLocalStorage,
} from '../../utils/authHelpers';
import store from '../../store';
import alertSlice from '../../store/alert';
import authSlice from '../../store/auth';
import Api from '../../api';
import { loginEvent, logoutEvent } from '../../utils/initAnalytics';

export const doLogin = (customUrl) => {
  const AUTH_BASE_URL = customUrl ?? process.env.REACT_APP_AUTH_BASEURL;
  const oauth = new ClientOAuth2({
    clientId: process.env.REACT_APP_CLIENTID,
    accessTokenUri: AUTH_BASE_URL + 'oauth/token',
    authorizationUri: AUTH_BASE_URL + 'oauth/auth',
    redirectUri: `${process.env.REACT_APP_ROOT_URL}oauthCallback.html`,
  });
  return new Promise((resolve, reject) => {
    window.authorizationCallback = { resolve, reject };
    window.open(oauth.token.getUri(), 'popupWindow', 'width=800,height=600');
  }).then((token) => {
    const decodedIdentityToken = decodeToken(token);
    if (decodedIdentityToken.aid !== undefined) {
      saveTokenToLocalStorage(token);
      store.dispatch(
        authSlice.actions.setUser({
          userdata: decodedIdentityToken,
          access_token: token.access_token,
          expires_in: token.expires_in,
        }),
      );
      Api.setAuthHeader(token.access_token);
      return token.access_token;
    } else {
      store.dispatch(
        alertSlice.actions.addAlert({
          type: 'WARNING',
          text: 'Invalid account\nPlease check your account status',
        }),
      );
      doLogout();
    }
  });
};

export const doLogout = () => {
  axios
    .get(`${process.env.REACT_APP_AUTH_BASEURL}oauth/logout?client_id=${process.env.REACT_APP_CLIENTID}`, {
      withCredentials: true,
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      store.dispatch(authSlice.actions.resetUser());
      removeTokenFromLocalStorage();
    });
};

const AuthHeader = ({ user, isEdcUser, customUrl, isImpersonating }) => {
  useEffect(() => {
    if (!isEdcUser && !isImpersonating) {
      // edc token won't be saved on localstorage since a call to the /token_sentinel_hub needs to be done to know if it's deployed on EDC or not.
      signInOnLoad();
    }
  }, [isEdcUser, isImpersonating]);

  const signInOnLoad = async (isImpersonating) => {
    try {
      const token = await getTokenFromLocalStorage();
      if (token && !isImpersonating) {
        store.dispatch(
          authSlice.actions.setUser({
            userdata: decodeToken(token),
            access_token: token.access_token,
            expires_in: token.expires_in,
          }),
        );
        Api.setAuthHeader(token.access_token);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      {!isEdcUser ? (
        <div>
          {user.userdata !== null ? (
            <button
              onClick={() => {
                doLogout();
                logoutEvent();
              }}
              className="button button--inactive"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                doLogin(customUrl);
                loginEvent();
              }}
              className="button button--inactive"
            >
              Login
            </button>
          )}
        </div>
      ) : null}
    </>
  );
};

const mapStateToProps = (store) => ({
  user: store.auth.user,
  isEdcUser: store.auth.isEDC,
  customUrl: store.params.oauthUrl,
  isImpersonating: store.auth.isImpersonating,
});

export default connect(mapStateToProps, null)(AuthHeader);
