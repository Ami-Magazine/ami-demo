import decode from 'jwt-decode';
import { loginUser, logoutUser, setNewTokens } from '/store/authSlice';
import { updateUserDetails } from '/store/userSlice';
import { refreshTokens } from '/api';
import { AuthencticatedUserAPI } from '/api/authenticateRequests';

async function redirectToLoginPage() {
  try {
    window.location.href = `${NEXT_PUBLIC_FRONTEND_URL}/login`;
  } catch (error) {}
}

function currentUserData() {
  return {
    id: localStorage?.getItem('id'),
    accessToken: localStorage?.getItem('token'),
    refreshToken: localStorage?.getItem('refreshToken'),
    email: localStorage?.getItem('email'),
    first_name: localStorage?.getItem('first_name'),
    last_name: localStorage?.getItem('last_name'),
  };
}

export async function refreshToken(dispatch) {
  const APIs = new AuthencticatedUserAPI();
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!token) dispatch(logoutUser());
  try {
    const accessTokenDecoded = decode(token);
    const refreshTokenDecoded = decode(refreshToken);
    const currentTime = new Date().getTime();
    if (accessTokenDecoded.exp - currentTime / 1000 < 0) {
      if (refreshTokenDecoded.exp - currentTime / 1000 < 0) {
        dispatch(logoutUser());
      } else {
        const data = await refreshTokens();
        dispatch(setNewTokens(data));
      }
    } else {
      const data = currentUserData();
      dispatch(loginUser(data));
      try {
        const data = await APIs.getUser();
        if (!data) {
          throw new Error('');
        }
        dispatch(updateUserDetails(data));
      } catch (error) {
        dispatch(logoutUser());
        redirectToLoginPage();
      }
      setTimeout(async () => {
        const data = await refreshTokens();
        dispatch(setNewTokens(data));
      }, accessTokenDecoded.exp * 1000 - currentTime);
    }
  } catch (error) {
    return;
  }
}
