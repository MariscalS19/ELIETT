import styles from './Sidebar.module.css';
import Link from 'next/link';

export default function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <h2 className={styles.sidebarTitle}>Admin Panel</h2>
            </div>
            <nav className={styles.sidebarNav}>
                <div className={styles.sidebarLinks}>
                    <Link href='/admin/dashboard'>Dashboard</Link>
                    <Link href='/admin/inventory'>Inventory</Link>
                    <Link href='/admin/collab'>Collaborations</Link>
                    <Link href='/admin/stats'>Statistics</Link>
                </div>
                <Link href='/admin/settings' className={styles.settingsLink}>
                    Settings
                </Link>
            </nav>
        </div>
    );
}
