import Styles from './productcard.module.scss';
import { directusUrl } from '/api/config';

export function ProductCard({ product, selected, selectedProduct }) {
  const notSelectedStyles = { backgroundColor: 'rgb(233, 145, 62, 0.2)' };

  return (
    <div
      className={`${Styles.card} ${selected ? Styles.selectedCard : ''}`}
      style={
        selectedProduct !== product && selectedProduct ? notSelectedStyles : {}
      }
    >
      <div className={Styles.name}>{product?.name}</div>
      <div
        className={Styles.image}
        style={{
          backgroundImage: `url(${directusUrl}/assets/${product?.image?.id})`,
        }}
      ></div>
      <div className={Styles.type}>
        {(() => {
          if (product.product_type.toLowerCase() === 'Both'.toLowerCase()) {
            return 'PRINT + DIGITAL';
          } else if (
            product.product_type.toLowerCase() === 'Digital'.toLowerCase()
          ) {
            return 'DIGITAL ONLY';
          } else if (
            product.product_type.toLowerCase() === 'Print'.toLowerCase()
          ) {
            return 'PRINT ONLY';
          }
        })()}
      </div>
      <div
        className={Styles.price}
        dangerouslySetInnerHTML={{ __html: product?.pricing_text }}
      />
      <div
        className={Styles.price_description}
        dangerouslySetInnerHTML={{ __html: product?.price_description }}
      />
      <div className={Styles.description}>
        <span>{product?.description}</span>
      </div>
    </div>
  );
}
