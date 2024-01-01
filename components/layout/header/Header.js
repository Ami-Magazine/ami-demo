import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '/store/authSlice';
import Styles from './header.module.scss';
import { useRef, useState, useEffect } from 'react';
import { PortalHeader } from '../portal-header/PortalHeader';
import { Logo } from '../../common/Logo/logo';
import { useWindowDimensions } from '../../../hooks/useWindow';

export function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user_details } = useSelector((state) => state.user);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const { width } = useWindowDimensions();

  const handleMenu = () => {
    if (width < 1000) {
      const element = document.getElementsByClassName('menu')[0];
      element.classList.toggle('menuClose');
      if (element.classList.contains('menuClose')) {
        document.body.style.overflowY = 'visible';
      } else {
        document.body.style.overflowY = 'hidden';
      }
    }
  };
  const handleClickedOutside = (e) => {
    if (!menu.current.contains(e.target)) {
      handleMenu();
    }
  };

  const dropDownOptions = [
    {
      label: 'Subscriptions',
      link: '/portal/my-subscriptions',
      alt: 'subscription',
      img: '/header/autorenewdark.svg',
      img_mb: '/header/autorenewdark_mb.svg',
    },
    {
      label: 'Payment Methods',
      link: '/portal/payments',
      alt: 'payment',
      img: '/header/dollardark.svg',
      img_mb: '/header/dollardark_mb.svg',
    },
    {
      label: 'Profile',
      link: '/portal/profile',
      alt: 'profile',

      img: '/header/profiledark.svg',
      img_mb: '/header/dollardark_mb.svg',
    },
    {
      label: 'Transactions',
      link: '/portal/transactions',
      alt: 'transaction',

      img: '/header/receiptdark.svg',
      img_mb: '/header/receiptdark_mb.svg',
    },
    {
      label: 'Support',
      link: '/portal/support',
      alt: 'support',
      img: '/header/supportdark.svg',
      img_mb: '/header/dollardark_mb.svg',
    },
    {
      label: 'Logout',
      alt: 'logout',
      link: '/login',
      img: '/header/logoutdark.svg',
      img_mb: '/header/logout_mb.svg',
    },
  ];
  const [mobileScreen, setMobileScreen] = useState(false);
  useEffect(() => {
    // window.matchMedia('(max-width: 1000px)').addEventListener('change', (e) => {
    //   setMobileScreen(e.matches);
    // });
    if (width < 1000) {
      setMobileScreen(true);
    } else {
      setMobileScreen(false);
    }
  }, [width]);
  useEffect(() => {
    const element = document.getElementsByClassName('menu')[0];
    if (element.classList.contains('menuClose')) {
      document.body.style.overflowY = 'visible';
    }
  }, []);

  const userName = useRef();
  const dropDown = useRef();

  useEffect(() => {
    document.body.addEventListener('click', (event) => {
      if (
        event.target != dropDown.current &&
        !dropDown.current?.contains(event.target)
      ) {
        setIsDropDownOpen(false);
      }
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (width > 800) {
      document.body.style.overflowY = 'auto';
    }
  }, [width]);

  const menu = useRef();
  const chayenuLogo = useRef();

  function handleOnMouseLeave(event) {
    event.stopPropagation();

    const parentElement = userName?.current;
    const childElement = dropDown?.current;

    if (event.relatedTarget instanceof Window) {
      setIsDropDownOpen(false);
      return;
    }

    const isMouseInsideParent = parentElement?.contains(event.relatedTarget);
    const isMouseInsideChild =
      childElement && childElement.contains(event.relatedTarget);
    if (!isMouseInsideParent && !isMouseInsideChild) {
      setIsDropDownOpen(false);
    }
  }

  return (
    <>
      <header className={Styles.header}>
        <div className={Styles.mobileHeader}>
          <div>
            <Image
              src="/hamburger.svg"
              alt="menu"
              height={30}
              width={30}
              loading="lazy"
              onClick={handleMenu}
            />
          </div>
          <div>
            <Link href="/" aria-label="Homepage">
              <Image src="/logoAMIMAG.jpg" alt="logo" width={60} height={30} />
            </Link>
          </div>
        </div>
        <div
          className={`${Styles.translucentLayer} menuClose menu`}
          onClick={(e) => {
            handleClickedOutside(e);
          }}
        >
          <div className={Styles.headerContainer} ref={menu}>
            <div onClick={handleMenu} className={Styles.logo}>
              <Link href="/" aria-label="Homepage">
                <Image
                  src="/logoAMIMAG.jpg"
                  alt="logo"
                  width={60}
                  height={30}
                />
              </Link>
            </div>
            <div>
              <ul>
                <li className={Styles.portalLink}>
                  <Link href="/subscribe" onClick={handleMenu}>
                    SUBSCRIBE
                  </Link>
                </li>
                <li className={Styles.portalLink}>
                  <Link href="/explore-chayenu" onClick={handleMenu}>
                    EXPLORE
                  </Link>
                </li>
                <li className={Styles.portalLink}>
                  <Link
                    href="https://chayenu.givingfuel.com/partner"
                    target="_blank"
                    onClick={handleMenu}
                  >
                    PARTNER
                  </Link>
                </li>
                <li className={Styles.portalLink}>
                  <Link
                    href="https://chayenu.givingfuel.com/donate"
                    target="_blank"
                    onClick={handleMenu}
                  >
                    DONATE
                  </Link>
                </li>
                <li className={Styles.portalLink}>
                  <Link
                    href="https://store.chayenu.org"
                    target="_blank"
                    onClick={handleMenu}
                  >
                    STORE
                  </Link>
                </li>
              </ul>
            </div>
            <div
              ref={userName}
              className={`${Styles.userDetails} `}
              onMouseLeave={(e) => handleOnMouseLeave(e)}
            >
              {isLoggedIn ? (
                <div className={Styles.login}>
                  <div onMouseEnter={() => setIsDropDownOpen(true)}>
                    <Image
                      src={
                        isDropDownOpen && !mobileScreen
                          ? '/profilecirculardark.svg'
                          : '/profilecircular.svg'
                      }
                      alt=""
                      height={16}
                      width={16}
                    />
                    <span
                      className={
                        isDropDownOpen && !mobileScreen
                          ? `${Styles.colorDark}`
                          : ''
                      }
                    >
                      ACCOUNT
                    </span>
                  </div>
                  {(isDropDownOpen || mobileScreen) && (
                    <ul
                      ref={dropDown}
                      onMouseLeave={(e) => handleOnMouseLeave(e)}
                    >
                      {
                        <div>
                          <li className={Styles.user_details}>
                            <span className={Styles.name}>
                              {user_details?.first_name}{' '}
                              {user_details?.last_name}
                            </span>
                            <span className={Styles.email}>
                              {user_details?.email}
                            </span>
                          </li>
                        </div>
                      }
                      {dropDownOptions.map((e, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setIsDropDownOpen(false);
                            if (e.label === 'Logout') {
                              dispatch(logoutUser());
                              router.push(e.link);
                            } else {
                              router.push(e.link);
                            }
                          }}
                        >
                          <li>
                            <Link
                              href={e.link}
                              aria-disabled={
                                e.label === 'Logout' ? true : false
                              }
                              onClick={handleMenu}
                            >
                              <Image
                                src={mobileScreen ? e?.img_mb : e?.img}
                                alt={e?.alt || ''}
                                height={16}
                                width={16}
                              />
                              {e?.label}
                            </Link>
                          </li>
                        </div>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div
                  className={`${Styles.loggedOut} ${Styles.portalLink}`}
                  onClick={handleMenu}
                >
                  <Link
                    href="/login"
                    onMouseEnter={() => {
                      chayenuLogo.current.src = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/profilecirculardark.svg`;
                    }}
                    onMouseLeave={() => {
                      chayenuLogo.current.src = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/profilecircular.svg`;
                    }}
                  >
                    <Image
                      src="/profilecircular.svg"
                      alt=""
                      height={16}
                      width={16}
                      ref={chayenuLogo}
                    />
                    LOGIN
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {router.pathname.split('/')[1] === 'portal' && <PortalHeader />}
    </>
  );
}
