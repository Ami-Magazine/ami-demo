import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllStories } from "../../api/common";
import { NextHead } from "/components/common";
import Styles from "../../styles/explore.module.scss";
import SubscribeStyles from "../../styles/subscribe.module.scss";
import { StoryCard } from "../../components/cards/StoryCard/StoryCard";
import { StoryCardSkeleton } from "../../components/cards/StoryCard/StoryCardSkeleton";
import { StoriesNav } from "../../components/common/StoriesNav/StoriesNav";
import { useSelector, useDispatch } from "react-redux";
import { updateStories } from "../../store/storiesSlice";

export default function Explore() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const { loaded, stories } = useSelector((state) => state.stories);
  const dispatch = useDispatch();

  async function getData() {
    try {
      if (loaded === false) {
        const { data } = await getAllStories();
        setLoading(false);
        dispatch(updateStories(data));
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError("An error occured, please try after some time");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <NextHead
        title="Ami | Explore"
        describe="Explore Ami Learn about each section of Ami below or subscribe now.Ami is your daily Torah study delivered every two weeks in print or digital"
      />
      {!error && (
        <>
          <StoriesNav />
          <main className={Styles.main}>
            <section>
              <div className={Styles.introWrapper}>
                <h1 className={Styles.title}>Explore Ami</h1>
                <p className={Styles.introParagraph}>
                  Learn about each section of Ami below or{' '}
                  <Link
                    className={Styles.introParagraphLinks}
                    href="/subscribe"
                  >
                    Subscribe now.
                  </Link>
                </p>
                <p className={Styles.introParagraph}>
                  Chayenu is your daily Torah study delivered every two weeks in
                  print or digital formats.
                </p>
                <p className={Styles.introParagraph}>
                  <Link
                    className={Styles.introParagraphLinks}
                    href="/subscribe"
                  >
                    Click here
                  </Link>{' '}
                  to go to the library of books used in the Chayenu weekly
                  Magazine
                </p>
              </div>

              <div className={Styles.storiesWrapper}>
                {loading &&
                  Array.apply(0, Array(2)).map(function (_, i) {
                    let index = (i += 1);
                    return (
                      <div key={index} className={Styles.skeletonWrapper}>
                        <StoryCardSkeleton key={index} />
                        <StoryCardSkeleton key={index + 1} />
                      </div>
                    );
                  })}
                {loading === false &&
                  stories.map((story, index) => {
                    if (index % 2 !== 0) return null;
                    const isLastItem = index === stories.length - 1;
                    if (isLastItem) {
                      return (
                        <div key={index} className={Styles.storyRow}>
                          <div className={Styles.storyWrapperLeft}>
                            <StoryCard key={story.id} story={story} />
                          </div>
                        </div>
                      );
                    }

                    const nextStory = stories[index + 1];
                    return (
                      <div key={index} className={Styles.storyRow}>
                        <div className={Styles.storyWrapperLeft}>
                          <StoryCard key={story.id} story={story} />
                        </div>
                        <div className={Styles.storyWrapperRight}>
                          <StoryCard key={nextStory.id} story={nextStory} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          </main>
        </>
      )}
      {error && <div className={SubscribeStyles.error}>{error}</div>}
    </>
  );
}
