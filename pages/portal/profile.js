import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Styles from '/styles/profile.module.scss';
import { updateUserDetails } from '/store/userSlice';
import { AuthencticatedUserAPI } from '/api/authenticateRequests';
import { Popup } from '/components/common';
import { EditProfile, ChangePassword } from '/components/forms';
import { NextHead } from '/components/common';
import { ProfileSkeleton } from '/components/cards';
import { PageLoadFailed } from '/components/common';

export default function Profile() {
  const APIs = new AuthencticatedUserAPI();

  const dispatch = useDispatch();
  const { user_details } = useSelector((state) => state.user);

  const [userDetails, setUserDetails] = useState({});
  const [popup, setPopup] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function getData() {
      const response = await APIs.getUser();
      if (!response) {
        setError('Unable to fetch data currently!');
        return;
      }
      setUserDetails(response);
      dispatch(updateUserDetails(response));
      setLoading(false);
    }
    if (Object.keys(user_details).length === 0) {
      getData();
    } else {
      setUserDetails(user_details);
      setLoading(false);
    }
  }, [user_details]);

  return (
    <>
      {error && <PageLoadFailed error={error} />}
      {!error &&
        (loading ? (
          <ProfileSkeleton />
        ) : (
          <section className={Styles.profileCard}>
            <NextHead title="Ami | Portal | Profile" />
            <div className={Styles.userDetailsAndEdit}>
              <div className={Styles.userDetails}>
                <div>Name:</div>
                <span className={Styles.profileData}>
                  <span>{userDetails?.first_name}</span>
                  <span>
                    {' '}
                    {userDetails?.last_name ? userDetails.last_name : ''}
                  </span>
                </span>
                <div>Email:</div>
                <span className={Styles.profileData}>{userDetails?.email}</span>
                <div>Phone:</div>
                <span className={Styles.profileData}>
                  {userDetails?.mobile}
                </span>
              </div>
              <button
                className={Styles.edit}
                onClick={() => {
                  setPopup('edit');
                }}
              >
                EDIT
              </button>
            </div>

            <div
              className={Styles.changePassword}
              onClick={() => {
                setPopup('changePassword');
              }}
            >
              CHANGE PASSWORD
            </div>
            {(() => {
              if (popup === 'edit') {
                return (
                  <Popup setPopupState={setPopup}>
                    <EditProfile
                      userProfile={userDetails}
                      setPopupState={setPopup}
                    />
                  </Popup>
                );
              } else if (popup === 'changePassword') {
                return (
                  <Popup setPopupState={setPopup}>
                    <ChangePassword setPopupState={setPopup} />
                  </Popup>
                );
              }
            })()}
          </section>
        ))}
    </>
  );
}
