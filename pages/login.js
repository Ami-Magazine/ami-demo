import { Formik } from 'formik';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextHead } from '/components/common';
import Link from 'next/link';
import * as Yup from 'yup';
import { login } from '/api';
import Styles from '/styles/login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';

export default function Login() {
  const [error, setError] = useState('');
  const { isLoggedIn } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/portal/my-subscriptions');
    }
  }, [isLoggedIn]);

  const initialValues = { email: undefined, password: undefined };
  const initialErrors = { email: undefined, password: undefined };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email('Enter valid email')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  return (
    <div className={Styles.loginContainer}>
      <NextHead title="Ami | Login" />
      <h1 className={Styles.loginText}>Login into Your Account</h1>
      <Formik
        initialValues={initialValues}
        initialErrors={initialErrors}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            setError('');
            const data = await login(values);
            dispatch(loginUser(data));
            router.push('/portal/my-subscriptions');
          } catch (error) {
            if (error?.response?.status === 401) {
              setError('Invalid credentials entered');
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
          <form className={Styles.loginInput} onSubmit={handleSubmit}>
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
              </span>
            </label>
            <label>
              <input
                type="password"
                placeholder="Passsword"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className={Styles.error}>
                {errors.password && touched.password && errors.password}
              </span>
            </label>
            <input type="submit" value="LOGIN" />
            {error && <span className={Styles.error}>{error}</span>}
            <div className={Styles.forgotPassword}>
              <Link href="/forgot-password">Forgot Your Password?</Link>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
