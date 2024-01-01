import Styles from "../styles/trial.module.scss";
import { NextHead } from "/components/common";
import { getTrialProduct } from "../api/common";
import Features from "../components/Trial/Features";
import Subscribe from "../components/Trial/Subscribe";
import Hero from "../components/Trial/Hero";
import Testimonials from "../components/Trial/Testimonials";

export default function Trial({ products }) {
  const product = products.data[0];

  return (
    <main>
      <NextHead
        title="Chayenu 1 Month Trial | Ami"
        description="Experience the transformative power of Chayenu with our exclusive trial. Dive into a wealth of Jewish wisdom, engaging articles, and inspiring Torah content. Start your journey today and discover why Chayenu is the ultimate companion for spiritual growth. Sign up for our trial and unlock a world of meaningful learning."
      />

      <section className={Styles.wrapper}>
        <Hero />
        <Features />
        <Testimonials />
        <Subscribe product={product} />
      </section>
    </main>
  );
}

export async function getServerSideProps() {
  const products = await getTrialProduct();
  return {
    props: {
      products,
    },
  };
}
