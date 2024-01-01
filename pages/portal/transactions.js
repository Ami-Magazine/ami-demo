import { useState, useEffect } from 'react';
import { AuthencticatedUserAPI } from '/api/authenticateRequests';
import Styles from '/styles/transactions.module.scss';
import { updateTransactions } from '/store/userSlice';
import { NextHead } from '/components/common';
import { PageLoadFailed } from '/components/common';
import { useSelector, useDispatch } from 'react-redux';
import { TransactionCard, TransactionsSkeleton } from '/components/cards';

export default function Transactions() {
  const APIs = new AuthencticatedUserAPI();
  const [transactionsList, setTransactionsList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { transactions } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const transactions = await APIs.getAllUserTransactions();
      if (!transactions) {
        setError('Unable to fetch data currently!');
        return;
      }
      setTransactionsList(transactions);
      dispatch(updateTransactions(transactions));
      setLoading(false);
    };
    if (transactions?.length === 0) {
      getData();
    } else {
      setTransactionsList(transactions);
      setLoading(false);
    }
  }, [transactions]);

  return (
    <>
      {error && <PageLoadFailed error={error} />}
      <section className={Styles.page}>
        <NextHead title="Ami | Portal | Transactions" />
        {!error && loading
          ? Array.apply(0, Array(3)).map(function (_, i) {
              return (
                <div key={i} className={Styles.productCard}>
                  <TransactionsSkeleton />
                </div>
              );
            })
          : transactionsList?.map((transaction, index) => (
              <TransactionCard key={index} transaction={transaction} />
            ))}
      </section>
    </>
  );
}
