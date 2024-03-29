import axios from 'axios';
import { backendUrl } from './config';

export async function login(values) {
  try {
    const { data } = await axios.post(`${backendUrl}/auth/signin`, {
      email: values.email,
      password: values.password,
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function refreshTokens() {
  try {
    const { data } = await axios.post(
      `${backendUrl}/auth/refreshTokens`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
}

export async function sendForgetPasswordOTP(email) {
  try {
    const { data } = await axios.post(`${backendUrl}/auth/forgotPassword`, {
      email: email,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function resetPassword(values) {
  try {
    const { data } = await axios.post(
      `${backendUrl}/auth/resetPassword`,
      values
    );
    return data;
  } catch (error) {
    throw error;
  }
}
