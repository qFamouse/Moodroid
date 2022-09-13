import styles from './statusbar.module.css';

export function StatusBar({message}) {
    
    return <div className={styles.statusbar}>{message}</div>
}