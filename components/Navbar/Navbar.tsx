import styles from './Navbar.module.css'
import Image from 'next/image'


function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.links}>
                {/* <a href="" className={styles.link}>New</a>
                <a href="" className={styles.link}>Shop</a>
                <a href="" className={styles.link}>About</a> */}
            </div>

            <div className={styles.logo_container}>
                <Image
                    src="/logo_eliett_negro.svg"
                    alt="ELLIET logo"
                    fill
                    unoptimized
                    priority
                />

            </div>
        </nav>
    )
}

export default Navbar