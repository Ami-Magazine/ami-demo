import Styles from "../styles/faq.module.scss";
import { NextHead } from "../components/common";
import { getFaqSectionsWithFAQs } from "../api/common";
import FAQSection from "../components/faq/FaqSection";
import { slugify } from "../api/util";

export default function FAQ({ faqSections }) {
  const questionEntities = [];

  faqSections.forEach((faqSection) => {
    faqSection.questions.forEach((question) => {
      questionEntities.push({
        "@type": "Question",
        name: question.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: question.answer,
        },
      });
    });
  });

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questionEntities,
  };

  const structuredData = <script
    key="structured-data"
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
  />

  return (
    <>
      <NextHead
        title="Knowledge Base | Ami - Daily Torah Study"
        description="Get answers to frequently asked questions about our products and services. Find solutions to common queries and make informed decisions. Explore now!"
        extraNode={structuredData}
      />
      <main className={Styles.main}>
        <div className={Styles.outlineWrapper}>
          <ul>
            {faqSections.map((faqSection) => (
              <li key={faqSection.id}>
                <a href={`#${slugify(faqSection.name)}`}>{faqSection.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <section className={Styles.page}>
          <h1 className={Styles.title}>Frequently Asked Questions</h1>
          {faqSections.map((faqSection) => (
            <FAQSection key={faqSection.id} faqSection={faqSection} />
          ))}
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const faqSections = await getFaqSectionsWithFAQs();

  return {
    props: {
      faqSections: faqSections.filter(
        (section) => section.questions.length > 0
      ),
    },
  };
}
