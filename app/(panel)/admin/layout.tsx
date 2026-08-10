import styles from './admin.module.css';
import Sidebar from '@/app/components/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.adminLayout}>
            <Sidebar />
            <main className={styles.main}>{children}</main>
        </div>
    );
}
