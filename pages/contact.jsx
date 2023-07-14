import * as Yup from 'yup';
import { useState } from 'react';
import { SupportRequestSubmitted } from '/components/cards';
import { Popup } from '/components/common';
import { Formik } from 'formik';
import Styles from '../styles/contact.module.scss';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [popup, setPopup] = useState();

  const initialValues = {
    full_name: '',
    email: '',
    message: '',
  };

  const initialErrors = {
    full_name: '',
    email: '',
    message: '',
  };

  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    message: Yup.string().required('Message is Required'),
  });

  return (
    <div className={Styles.contact}>
      <Formik
        initialValues={initialValues}
        initialErrors={initialErrors}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setLoading(true);
          try {
            console.log('send mail here', values);
          } catch (error) {
            setRequestError('Unable to send message. Please try again later.');
          }
          setPopup('requestProcessed');
          setLoading(false);
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
          <form className={Styles.form} onSubmit={handleSubmit}>
            <div className={Styles.nameAndEmail}>
              <div>
                <input
                  type="text"
                  placeholder="Full Name *"
                  name="full_name"
                  value={values.full_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className={Styles.error}>
                  {errors.full_name && touched.full_name && errors.full_name}
                </span>
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address*"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className={Styles.error}>
                  {errors.email && touched.email && errors.email}
                </span>
              </div>
            </div>
            <div className={Styles.message}>
              <textarea
                name="message"
                placeholder="Message *"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className={Styles.error}>
                {errors.message && touched.message && errors.message}
              </span>
            </div>
            <div className={Styles.submitButton}>
              <button
                type="submit"
                className={`${loading ? `${Styles.disabled}` : ''}`}
              >
                SUBMIT
              </button>
            </div>
          </form>
        )}
      </Formik>
      {(() => {
        if (popup === 'requestProcessed') {
          return (
            <Popup setPopupState={setPopup}>
              <SupportRequestSubmitted
                requestError={requestError}
                redirectToPortal={false}
              />
            </Popup>
          );
        }
      })()}
    </div>
  );
}
