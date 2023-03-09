import Styles from './summary.module.scss';
import { useState } from 'react';

export function Summary({
  selectedPlan,
  autoRenewal,
  values,
  handleChange,
  handleBlur,
  coupon,
}) {
  const [isDisabled, setIsDisabled] = useState(true);
  const optionsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const calculateDiscountedPrice = (price, coupon) => {
    if (coupon?.amount_type?.toLowerCase() === 'percentage') {
      return price - (price * coupon.amount) / 100;
    } else {
      return price - coupon?.amount;
    }
  };

  return (
    <div className={Styles.summary}>
      <div className={Styles.planType}>
        <span>{selectedPlan?.name}</span>
        <span>
          {!coupon
            ? `$${selectedPlan.price}`
            : `$${calculateDiscountedPrice(selectedPlan.price, coupon)}`}
        </span>
      </div>
      <div className={Styles.additional}>
        <div>
          Quantity:
          <select
            name="quantity"
            disabled={isDisabled}
            value={values.quantity}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {optionsList.map(function (x) {
              return (
                <option key={x} value={x}>
                  {x}
                </option>
              );
            })}
          </select>
          <span
            className={Styles.change}
            onClick={() => {
              setIsDisabled(!isDisabled);
            }}
          >
            {isDisabled ? 'Change' : 'Update'}
          </span>
        </div>
        <div>{autoRenewal ? 'Auto renewal on' : 'Auto renewal off'}</div>
      </div>
    </div>
  );
}