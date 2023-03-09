import Image from 'next/image';
import { useRouter } from 'next/router';
import Styles from './header.module.scss';
import { useRef } from 'react';
import Link from 'next/link';

export function Header() {
  const router = useRouter();

  const handleMenu = () => {
    const element = document.getElementsByClassName('menu')[0];
    element.classList.toggle('menuClose');
  };
  const handleClickedOutside = (e) => {
    if (!menu.current.contains(e.target)) {
      handleMenu();
    }
  };
  const menu = useRef();

  return (
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
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="logo"
            height={50}
            width={80}
            loading="lazy"
          />
        </Link>
      </div>
      <div
        className={`${Styles.translucentLayer} menuClose menu`}
        onClick={(e) => {
          handleClickedOutside(e);
        }}
      >
        <div className={Styles.container} ref={menu}>
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="logo"
              height={38}
              width={60}
              loading="lazy"
            />
          </Link>
          <div>
            <ul>
              <li>
                <Link href="/explore">Subscribe</Link>
              </li>
              <li>
                <Link href="/explore">Explore</Link>
              </li>
            </ul>
          </div>
          <div className={Styles.login} onClick={() => router.push('/login')}>
            <Image
              src="/profile.svg"
              alt="Profile image"
              height={16}
              width={16}
            />
            LOGIN
          </div>
        </div>
      </div>
    </header>
  );
}
