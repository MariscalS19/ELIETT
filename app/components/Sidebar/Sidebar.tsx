'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Sidebar.module.css';
import {
    LuLayoutDashboard,
    LuBoxes,
    LuUsers,
    LuChartBar,
    LuSettings,
    LuChevronLeft,
    LuChevronRight,
} from 'react-icons/lu';

type NavItem = {
    href: string;
    label: string;
    icon: 'dashboard' | 'inventory' | 'collab' | 'stats' | 'settings';
};

const navItems: NavItem[] = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/inventory', label: 'Inventory', icon: 'inventory' },
    { href: '/admin/collab', label: 'Collabs', icon: 'collab' },
    { href: '/admin/stats', label: 'Stats', icon: 'stats' },
];

function SidebarIcon({ type }: { type: NavItem['icon'] }) {
    const iconProps = {
        className: styles.svgIcon,
        'aria-hidden': true,
    };

    switch (type) {
        case 'dashboard':
            return <LuLayoutDashboard {...iconProps} />;
        case 'inventory':
            return <LuBoxes {...iconProps} />;
        case 'collab':
            return <LuUsers {...iconProps} />;
        case 'stats':
            return <LuChartBar {...iconProps} />;
        case 'settings':
            return <LuSettings {...iconProps} />;
        default:
            return null;
    }
}

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const sidebarClassName = collapsed
        ? `${styles.sidebar} ${styles.collapsed}`
        : styles.sidebar;

    return (
        <aside className={sidebarClassName}>
            <div className={styles.sidebarHeader}>
                <button
                    type='button'
                    className={styles.toggleButton}
                    onClick={() => setCollapsed((prev) => !prev)}
                    aria-label={
                        collapsed ? 'Expand sidebar' : 'Collapse sidebar'
                    }>
                    {collapsed ? <LuChevronRight /> : <LuChevronLeft />}
                </button>
                {!collapsed && <h2 className={styles.sidebarTitle}>Panel</h2>}
            </div>

            <nav className={styles.sidebarNav} aria-label='Sidebar navigation'>
                <div className={styles.sidebarLinks}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={styles.navItem}
                            title={item.label}>
                            <span className={styles.iconWrap}>
                                <SidebarIcon type={item.icon} />
                            </span>
                            {!collapsed && (
                                <span className={styles.label}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>

                <Link
                    href='/admin/settings'
                    className={`${styles.navItem} ${styles.settingsLink}`}
                    title='Settings'>
                    <span className={styles.iconWrap}>
                        <SidebarIcon type='settings' />
                    </span>
                    {!collapsed && (
                        <span className={styles.label}>Settings</span>
                    )}
                </Link>
            </nav>
        </aside>
    );
}
