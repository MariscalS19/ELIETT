'use client';
import styles from './Login.module.css';
import { PasswordIcon } from '../icons/PasswordIcon';
import { useActionState } from 'react';
import { logAdminAction } from '@/backend/actions/authActions';

function Login() {
    const [state, formAction, isPending] = useActionState(logAdminAction, null);
    const hasError = state && !state.success;
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginHeader}>
                <h1 className={styles.loginTitle}>Welcome <br /> back</h1>
                <h2 className={styles.loginSubtitle}>Eliett</h2>
            </div>
            <form className={styles.loginForm} action={formAction}>
                <div className={styles.inputWrapper}>
                    <input id="password" name="password" type="password" placeholder="" className={`${styles.loginInput} ${hasError ? styles.inputError : ''}`} autoComplete="current-password" disabled={isPending} />
                    <PasswordIcon className={`${styles.inputIcon} ${hasError ? styles.iconError : ''}`} />
                    <label htmlFor="password" className={`${styles.loginLabel} ${hasError ? styles.labelError : ''}`}>Password</label>
                    {hasError && <p className={styles.errorMessage}>{state.message}</p>}
                </div>
                <button type="submit" className={styles.loginButton} disabled={isPending}>
                    {isPending ? 'Verifying...' : 'Log In'}
                </button>
            </form>
        </div>
    );
}
export default Login;