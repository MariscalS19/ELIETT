'use client';
import styles from './LoginForm.module.css';
import { useActionState, useEffect } from 'react';
import { LuLock } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { logAdminAction } from '@/backend/actions/authActions';

function LoginForm() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(logAdminAction, null);
    const hasError = state && !state.success;

    useEffect(() => {
        if (state?.success) {
            router.replace('/admin/dashboard');
        }
    }, [state, router]);

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginHeader}>
                <h1 className={styles.loginTitle}>
                    Welcome <br /> Back
                </h1>
                <h2 className={styles.loginSubtitle}>Eliett</h2>
            </div>
            <form className={styles.loginForm} action={formAction}>
                <div className={styles.inputWrapper}>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        placeholder=''
                        className={`${styles.loginInput} ${hasError ? styles.inputError : ''}`}
                        autoComplete='current-password'
                        disabled={isPending}
                    />
                    <LuLock
                        className={`${styles.inputIcon} ${hasError ? styles.iconError : ''}`}
                    />
                    <label
                        htmlFor='password'
                        className={`${styles.loginLabel} ${hasError ? styles.labelError : ''}`}>
                        Password
                    </label>
                    {hasError && (
                        <p className={styles.errorMessage}>{state.message}</p>
                    )}
                </div>
                <button
                    type='submit'
                    className={styles.loginButton}
                    disabled={isPending}>
                    {isPending ? 'Verifying...' : 'Log In'}
                </button>
            </form>
        </div>
    );
}
export default LoginForm;
