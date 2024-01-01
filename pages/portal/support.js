import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { NextHead, PageLoadFailed, Popup } from '/components/common';
import { Formik } from 'formik';
import Select from 'react-select';
import { AuthencticatedUserAPI } from '/api/authenticateRequests';
import { getAllSupportIssues } from '/api/common';
import { updateSubscriptions, updateSupportIssues } from '/store/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { SupportRequestSubmitted } from '/components/cards';
import Styles from '/styles/support.module.scss';

export default function Support() {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(undefined);
  const [error, setError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [subscriptionsList, setSubscriptionsList] = useState([]);
  const [supportIssues, setSupportIssues] = useState([]);

  const { support_issues, subscriptions } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const APIs = new AuthencticatedUserAPI();

  useEffect(() => {
    async function getData() {
      const newSubscriptions = await APIs.getAllUserSubscriptions();
      if (!newSubscriptions) {
        setError('Unable to fetch data currently!');
        return;
      }
      newSubscriptions?.push({ id: 0, label: 'Others' });
      setSubscriptionsList(newSubscriptions);
      dispatch(updateSubscriptions(newSubscriptions));
    }
    if (subscriptions?.length === 0) {
      getData();
    } else {
      if (subscriptions) {
        const newSubscriptions = [...subscriptions];
        newSubscriptions?.push({ id: 0, label: 'Others' });
        setSubscriptionsList(newSubscriptions);
      }
    }
  }, [subscriptions]);

  useEffect(() => {
    async function getData() {
      const { data: newSupportIssues } = await getAllSupportIssues();
      if (!newSupportIssues) {
        setError('Unable to fetch data currently!');
        return;
      }
      setSupportIssues(newSupportIssues);
      dispatch(updateSupportIssues(newSupportIssues));
    }
    if (support_issues?.length === 0) {
      getData();
    } else {
      setSupportIssues(support_issues);
    }
  }, [support_issues]);

  function getStatusClass(status) {
    switch (status) {
      case 'Active':
        return Styles.active;
      case 'Expired':
        return Styles.expired;
      case 'Processing':
        return Styles.processing;
      case 'On Hold':
        return Styles.onhold;
      case 'Cancelled':
        return Styles.expired;
      default:
        return 'Invalid status.';
    }
  }

  function formatSubscriptionLabel(subscriptionData) {
    const subscription = { ...subscriptionData };
    if (subscriptionData.status === 'On_Hold') {
      subscription.status = 'On Hold';
    }
    if (subscription.id === 0) {
      return <div className={Styles.subscriptionOptions}>Others</div>;
    } else {
      return (
        <div className={Styles.subscriptionOptions}>
          <span>{subscription?.plans.name}</span>
          <span>
            <span>{subscription?.first_name}</span>
            <span className={Styles.lastname}>{subscription?.last_name}</span>
          </span>
          <span className={getStatusClass(subscription.status)}>
            {subscription?.status}
          </span>
        </div>
      );
    }
  }

  function formatIssuesLabel(issue) {
    return (
      <div className={Styles.supportIssuesOptions}>{issue.description}</div>
    );
  }

  const style = {
    control: (base) => ({
      ...base,
      border: 0,
      boxShadow: 'none',
      fontFamily: 'Brandon Grotesque',
    }),
  };

  const initialValues = {
    subscription: undefined,
    support_issue: undefined,
    notes: undefined,
  };
  const initialErrors = {
    subscription: undefined,
    support_issue: undefined,
    notes: undefined,
  };

  const validationSchema = Yup.object().shape({
    subscription: Yup.number().required('Subscription must be selected'),
    support_issue: Yup.number().required('Support Issue must be selected'),
    notes: Yup.string().required('Please write a note'),
  });

  return (
    <>
      {error && <PageLoadFailed error={error} />}
      {!error && (
        <>
          <NextHead title="Ami | Portal | Support" />
          <Formik
            initialValues={initialValues}
            initialErrors={initialErrors}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                setLoading(true);
                const response = await APIs.submitSupportRequest(values);
                setPopup('requestProcessed');
                setLoading(false);
              } catch (error) {
                setPopup('requestProcessed');
                setRequestError(
                  'Unable to submit request now, please reach us by mail info@chayenu.org'
                );
                setLoading(false);
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
              <form className={Styles.form} onSubmit={handleSubmit}>
                <div className={Styles.getSupport}>Get Support</div>
                <div>
                  <Select
                    name="subscription"
                    placeholder="Subscription"
                    options={subscriptionsList}
                    styles={style}
                    formatOptionLabel={(subscription) =>
                      formatSubscriptionLabel(subscription)
                    }
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    getOptionValue={(option) => option.id}
                    onBlur={handleBlur}
                    onChange={(value) => {
                      values.subscription = value.id;
                    }}
                  />
                  <span className={Styles.error}>
                    {errors.subscription &&
                      touched.subscription &&
                      errors.subscription}
                  </span>
                </div>
                <div>
                  <Select
                    name="subscription"
                    placeholder="Support Issues"
                    options={supportIssues}
                    styles={style}
                    formatOptionLabel={(issue) => formatIssuesLabel(issue)}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    getOptionValue={(option) => option.id}
                    onBlur={handleBlur}
                    onChange={(value) => {
                      values.support_issue = value.id;
                    }}
                  />
                  <span className={Styles.error}>
                    {errors.support_issue &&
                      touched.support_issue &&
                      errors.support_issue}
                  </span>
                </div>
                <div>
                  <textarea
                    name="notes"
                    placeholder="Notes"
                    rows="10"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.notes}
                  />
                  <span className={Styles.error}>
                    {errors.notes && touched.notes && errors.notes}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`${loading ? `${Styles.disabled}` : ''}`}
                >
                  {!loading ? 'Submit' : 'Submiting...'}
                </button>
              </form>
            )}
          </Formik>
          {(() => {
            if (popup === 'requestProcessed') {
              return (
                <Popup setPopupState={setPopup}>
                  <SupportRequestSubmitted
                    requestError={requestError}
                    redirectToPortal={true}
                  />
                </Popup>
              );
            }
          })()}
        </>
      )}
    </>
  );
}
