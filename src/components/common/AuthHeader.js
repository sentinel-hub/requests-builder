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
import store, { authSlice } from '../../store';

const oauth = new ClientOAuth2({
  clientId: process.env.REACT_APP_CLIENTID,
  accessTokenUri: process.env.REACT_APP_AUTH_BASEURL + 'oauth/token',
  authorizationUri: process.env.REACT_APP_AUTH_BASEURL + 'oauth/auth',
  redirectUri: `${process.env.REACT_APP_ROOT_URL}oauthCallback.html`,
});

export const doLogin = () => {
  return new Promise((resolve, reject) => {
    window.authorizationCallback = { resolve, reject };
    window.open(oauth.token.getUri(), 'popupWindow', 'width=800,height=600');
  }).then((token) => {
    saveTokenToLocalStorage(token);
    store.dispatch(
      authSlice.actions.setUser({
        userdata: decodeToken(token),
        access_token: token.access_token,
        expires_in: token.expires_in,
      }),
    );
    return token.access_token;
  });
};

export const doLogout = () => {
  axios
    .get(process.env.REACT_APP_AUTH_BASEURL + 'oauth/logout', {
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

const AuthHeader = ({ user, isEdcUser }) => {
  useEffect(() => {
    if (!isEdcUser) {
      // edc token won't be saved on localstorage since a call to the /token_sentinel_hub needs to be done to know if it's deployed on EDC or not.
      signInOnLoad();
    }
  }, [isEdcUser]);

  const signInOnLoad = async () => {
    try {
      const token = await getTokenFromLocalStorage();
      if (token) {
        store.dispatch(
          authSlice.actions.setUser({ userdata: decodeToken(token), access_token: token.access_token }),
        );
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
            <button onClick={doLogout} className="button button--inactive">
              Logout
            </button>
          ) : (
            <button onClick={doLogin} className="button button--inactive">
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
});

export default connect(mapStateToProps, null)(AuthHeader);
