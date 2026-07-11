import styles from './LoginPage.module.css';
import Image from "next/image";
import LoginForm from "@/app/components/LoginForm";

export default function LoginPage() {
    return (
        <div className={styles.loginPage}>
            <LoginForm />
            <div className={styles.img_container}>
                <Image
                    className={styles.login_img}
                    src="/loginCover.webp"
                    alt="Login background image"
                    fill
                    priority
                    sizes="50vw"
                    quality={75}
                />
            </div>
        </div >

    )
}