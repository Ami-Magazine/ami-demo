import * as Yup from 'yup';
import { useState } from 'react';
import { SupportRequestSubmitted } from '/components/cards';
import { Popup, NextHead } from '/components/common';
import { Formik } from 'formik';
import Styles from '../styles/contact.module.scss';
import { sendContactUsEmail } from '../api/contact-us';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [popup, setPopup] = useState();

  const initialValues = {
    fullName: '',
    email: '',
    message: '',
  };

  const initialErrors = {
    fullName: '',
    email: '',
    message: '',
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    message: Yup.string().required('Message is Required'),
  });

  return (
    <>
      <NextHead
        title="Contact Ami"
        description="Get answers to frequently asked questions about our products and services. Find solutions to common queries and make informed decisions. Explore now!"
      />
      <div className={Styles.contact}>
        <Formik
          initialValues={initialValues}
          initialErrors={initialErrors}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              await sendContactUsEmail(values);
              console.log('send mail here', values);
            } catch (error) {
              setRequestError(
                'Unable to send message. Please try again later.'
              );
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
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span className={Styles.error}>
                    {errors.fullName && touched.fullName && errors.fullName}
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
    </>
  );
}
