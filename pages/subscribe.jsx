import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { NextHead } from '../components/common';
import Styles from '../styles/subscribe.module.scss';
import { getAllProducts } from '../api/common';
import { useWindowDimensions } from '../hooks';

import { ProductCard, ProductCardSkeleton } from '../components/cards';
import {
  DigitalSubscriptionForm,
  PrintDigitalSubscriptionForm,
} from '../components/forms';

export default function Subscribe({ query }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [selectedProduct, setSelectedProduct] = useState(undefined);

  const { width } = useWindowDimensions();

  const autoScroll = useCallback(
    (node) => {
      if (node != null) {
        node.scrollIntoView({ behavior: 'smooth' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Shut up ESLint
    [selectedProduct]
  );

  async function getData() {
    try {
      const productQuery = {};

      if (query.student_only === 'true') {
        productQuery.student_only = true;
      }

      if (query.is_military_only === 'true') {
        productQuery.is_military_only = true;
      }

      if (query.is_shluchim_only === 'true') {
        productQuery.is_shluchim_only = true;
      }

      const { data } = await getAllProducts(productQuery);

      setLoading(false);
      setAllProducts(data);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError('A error occured, please try after some time');
    }
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Shut up ESLint
  }, [query]);

  const centerCardStyles = { transform: 'scale(1.1)' };

  function getContentHeader() {
    if (query.is_military_only) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '24px',
          }}
        >
          <Image
            src="/us-army.svg"
            alt="logo"
            height={100}
            width={75.6}
            loading="lazy"
          />
          <p className={Styles.studentmilitaryline}>
            Special Chayenu subscription rates exclusively for members of the
            Military
          </p>
        </div>
      );
    }

    if (query.is_shluchim_only) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '24px',
          }}
        >
          <p className={Styles.studentmilitaryline}>
          Special Chayenu subscription rates exclusively for Shluchim.
          </p>
        </div>
      );
    }

    if (query.student_only) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '24px',
          }}
        >
          <Image
            src="/chabad-on-campus.svg"
            alt="logo"
            height={100}
            width={162.22}
            loading="lazy"
          />
          <p className={Styles.studentmilitaryline}>
            Special Chayenu Subscription Rates Exclusively for Students
          </p>
        </div>
      );
    }

    return <div className={Styles.subscribe}>Subscribe to Chayenu</div>;
  }

  return (
    <>
      <NextHead
        title="Ami | Subscribe"
        description="Subscribe to Chayenu, Chayenu is delivered in print or digital formats."
      />
      {!error && (
        <>
          {getContentHeader()}
          <h1 className={Styles.selectProduct}>Select Product</h1>
          <div className={Styles.products}>
            {loading
              ? Array.apply(0, Array(3)).map(function (_, i) {
                  return (
                    <div key={i} className={Styles.productCard}>
                      <ProductCardSkeleton />
                    </div>
                  );
                })
              : allProducts.map((product, index) => {
                  return (
                    <div
                      key={product.id}
                      className={Styles.productCard}
                      onClick={() => {
                        setSelectedProduct(product);
                      }}
                      style={
                        !query.student_only &&
                        !query.is_military_only &&
                        allProducts?.length === 3 &&
                        width > 1300
                          ? index === 1
                            ? centerCardStyles
                            : {}
                          : {}
                      }
                    >
                      <ProductCard
                        product={product}
                        selected={selectedProduct?.id === product?.id}
                        selectedProduct={selectedProduct}
                      />
                    </div>
                  );
                })}
          </div>
        </>
      )}
      {error && <div className={Styles.error}>{error}</div>}
      {selectedProduct && (
        <>
          {(() => {
            if (selectedProduct.product_type.toLowerCase() === 'digital') {
              return (
                <DigitalSubscriptionForm
                  selectedProduct={selectedProduct}
                  is_military_only={query.is_military_only}
                  is_shluchim_only={query.is_shluchim_only}
                  student_only={query.student_only}
                  autoScroll={autoScroll}
                />
              );
            } else {
              return (
                <PrintDigitalSubscriptionForm
                  selectedProduct={selectedProduct}
                  is_military_only={query.is_military_only}
                  is_shluchim_only={query.is_shluchim_only}
                  student_only={query.student_only}
                  autoScroll={autoScroll}
                />
              );
            }
          })()}
        </>
      )}
    </>
  );
}

export function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}
