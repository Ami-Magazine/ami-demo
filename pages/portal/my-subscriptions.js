import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextHead } from '/components/common';
import Link from 'next/link';
import { updateSubscriptions } from '/store/userSlice';
import { SubscriptionCard } from '/components/cards';
import { SubscriptionCardSkeleton } from '/components/cards';
import Styles from '/styles/my-subscription.module.scss';
import { AuthencticatedUserAPI } from '/api/authenticateRequests';
import { PageLoadFailed } from '/components/common';

export default function MySubcriptions() {
  const dispatch = useDispatch();
  const { subscriptions } = useSelector((state) => state.user);
  const [allSubscriptions, setAllSubscriptions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const APIs = new AuthencticatedUserAPI();

  useEffect(() => {
    async function getData() {
      const newSubscriptions = await APIs.getAllUserSubscriptions();
      if (!newSubscriptions) {
        setError('Unable to fetch data currently!');
        return;
      }
      setAllSubscriptions(newSubscriptions);
      dispatch(updateSubscriptions(newSubscriptions));
      setLoading(false);
    }
    if (subscriptions?.length === 0) {
      getData();
    } else {
      setAllSubscriptions(subscriptions);
      setLoading(false);
    }
  }, [subscriptions]);

  return (
    <>
      {error && <PageLoadFailed error={error} />}
      {!error && (
        <section>
          <NextHead title="Ami | Portal | Subcsriptions" />
          <div className={Styles.subscriptionCard}>
            {loading
              ? Array.apply(0, Array(3)).map(function (_, i) {
                  return (
                    <div key={i}>
                      <SubscriptionCardSkeleton />
                    </div>
                  );
                })
              : allSubscriptions?.map((subscription, index) => (
                  <SubscriptionCard
                    key={index}
                    subscription={subscription}
                    setLoading={setLoading}
                  />
                ))}
          </div>
          <div className={Styles.addSubscription}>
            <button>
              <Link href="/subscribe">ADD SUBSCRIPTION</Link>
            </button>
          </div>
        </section>
      )}
    </>
  );
}
