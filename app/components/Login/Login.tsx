import styles from './Login.module.css';
import { EmailIcon } from '../icons/EmailIcon';
import { PasswordIcon } from '../icons/PasswordIcon';

function Login() {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginHeader}>
                <h1 className={styles.loginTitle}>Welcome <br></br> back</h1>
                <h2 className={styles.loginSubtitle}>Eliett</h2>
            </div>
            <form className={styles.loginForm}>
                <div className={styles.inputWrapper}>
                    <EmailIcon className={styles.inputIcon} />
                    <input id="email" type="email" placeholder=" " className={styles.loginInput} autoComplete="email" />
                    <label htmlFor="email" className={styles.loginLabel}>Email</label>
                </div>
                <div className={styles.inputWrapper}>
                    <PasswordIcon className={styles.inputIcon} />
                    <input id="password" type="password" placeholder=" " className={styles.loginInput} autoComplete="current-password" />
                    <label htmlFor="password" className={styles.loginLabel}>Password</label>

                </div>
                <button type="submit" className={styles.loginButton}>
                    Login
                </button>
            </form>
        </div>
    );
}
export default Login;