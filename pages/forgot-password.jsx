import { Formik } from 'formik';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NextHead } from '/components/common';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { sendForgetPasswordOTP, resetPassword } from '/api';
import { toastTemplate, sleep } from '/components/common';
import { logoutUser } from '../store/authSlice';
import * as Yup from 'yup';
import Styles from '/styles/forgotpassword.module.scss';
import { Popup, Alert } from '../components/common';
import Link from 'next/link';

export default function ForgotPassword() {
  const [error, setError] = useState('');
  const [forgotPasswordStage, setForgotPasswordStage] = useState('OTP');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const initialValuesSendOTP = { email: '' };
  const initialErrorsSendOTP = { email: '' };

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
  }, []);

  const initialValuesChangePassword = {
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: '',
  };
  const initialErrorsChangePassword = {
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const validationSchemaSendOTP = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email('Enter valid email')
      .required('Email is required'),
  });

  const validationSchemaChangePassword = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email('Enter valid email')
      .required('Email is required'),
    otp: Yup.string().required('OTP is required'),
    newPassword: Yup.string()
      .required('New Password is Required')
      .min(8, 'New Password is too short - should be 8 chars minimum.')
      .matches(/(?=.*[0-9])/, 'New Password must contain a number.'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], "Passwords don't match")
      .required('Confirm new password is required'),
  });

  return (
    <div className={Styles.forgotPasswordContainer}>
      <NextHead title="Ami | Forgot Password" />
      {forgotPasswordStage === 'OTP' ? (
        <>
          <h1 className={Styles.emailText}>Enter your email</h1>
          <Formik
            initialValues={initialValuesSendOTP}
            initialErrors={initialErrorsSendOTP}
            validationSchema={validationSchemaSendOTP}
            enableReinitialize={true}
            onSubmit={async (values) => {
              try {
                setError('');
                const response = await sendForgetPasswordOTP(values.email);
                setForgotPasswordStage('enterNewPassword');
              } catch (error) {
                if (
                  error?.response?.status === 404 ||
                  error?.response?.status === 400
                ) {
                  setError('Email not found');
                  setShowAlert(true);
                } else {
                  setError('A error occured');
                }
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form className={Styles.emailInput} onSubmit={handleSubmit}>
                <label>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span className={Styles.error}>
                    {errors.email && touched.email && errors.email}
                    {error && <span className={Styles.error}>{error}</span>}
                  </span>
                </label>
                <input type="submit" value="SEND OTP" />
              </form>
            )}
          </Formik>
        </>
      ) : (
        <>
          <div className={Styles.passwordText}>Enter New Password</div>
          <Formik
            initialValues={initialValuesChangePassword}
            initialErrors={initialErrorsChangePassword}
            validationSchema={validationSchemaChangePassword}
            enableReinitialize={true}
            onSubmit={async (values) => {
              const loadingToast = toastTemplate(
                toast.loading,
                'Changing password...'
              );
              try {
                setError('');
                setLoading(true);
                const response = await resetPassword(values);
                toastTemplate(
                  toast.success,
                  'Password changes successfully\n redirecting to login page',
                  loadingToast
                );
                await sleep(3000);
                setLoading(false);
                router.push('/login');
              } catch (error) {
                console.log(error);
                setLoading(false);
                if (error?.response?.status === 404) {
                  setError('Invalid OTP');
                } else {
                  setError('A error occured');
                }
                toastTemplate(
                  toast.error,
                  'Password change unsuccessful',
                  loadingToast
                );
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form className={Styles.passwordInput} onSubmit={handleSubmit}>
                <label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </label>
                <label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span className={Styles.error}>
                    {errors.newPassword &&
                      touched.newPassword &&
                      errors.newPassword}
                  </span>
                </label>
                <label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    placeholder="Confirm new Password"
                    value={values.confirmNewPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span className={Styles.error}>
                    {errors.confirmNewPassword &&
                      touched.confirmNewPassword &&
                      errors.confirmNewPassword}
                  </span>
                </label>
                <label>
                  <input
                    type="password"
                    name="otp"
                    placeholder="OTP"
                    value={values.otp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span className={Styles.error}>
                    {errors.otp && touched.otp && errors.otp}
                  </span>
                </label>
                {error && <span className={Styles.error}>{error}</span>}
                <input
                  type="submit"
                  value={!loading ? 'Change Password' : 'Changing...'}
                  disabled={loading}
                  className={`${loading ? `${Styles.disabled}` : ''}`}
                />
              </form>
            )}
          </Formik>
        </>
      )}
      {showAlert && (
        <Popup setPopupState={setShowAlert}>
          <Alert level={1}>
            <h3 className={Styles.popupTitle}>
              {'No user found with this email address.'}
            </h3>
            <p>
              {"If you made a Chayenu account using Chayenu's old system "}
              <Link target="_blank" href="https://old.chayenu.org/my-account/">
                <span className={Styles.link}>click here</span>
              </Link>
              {' to manage your account'}
            </p>
          </Alert>
        </Popup>
      )}
    </div>
  );
}
