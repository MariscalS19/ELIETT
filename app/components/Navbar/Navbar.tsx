import styles from './Navbar.module.css';
import Image from 'next/image';
import { LuInstagram } from 'react-icons/lu';
function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.links}></div>

            <div className={styles.logo_container}>
                <Image
                    src='/eliett_black_logo.svg'
                    alt='ELLIET logo'
                    fill
                    unoptimized
                    priority
                />
            </div>
            <a
                href='https://www.instagram.com/the.eliett'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.insta_button}>
                <LuInstagram className={styles.insta_icon} />
            </a>
        </nav>
    );
}

export default Navbar;
