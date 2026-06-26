import styles from './LoginPage.module.css';
import Image from "next/image";
import Login from "@/app/components/Login";

export default function LoginPage() {
    return (
        <div className={styles.loginPage}>
            <Login />
            <div className={styles.img_container}>
                <Image
                    className={styles.login_img}
                    src="/loginCover.webp"
                    alt="Login background image"
                    fill
                    priority
                    sizes="50vw"
                    quality={100}
                    unoptimized
                />
            </div>
        </div >

    )
}