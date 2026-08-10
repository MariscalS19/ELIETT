import styles from './collab.module.css';
export default function CollabPage() {
    return (
        <section className={styles.panel}>
            <div className={styles.panelHeader}>
                <h2>Agregar producto de colaboración</h2>
                <span>Coordina piezas especiales con otros creadores</span>
            </div>

            <form className={styles.form}>
                <label className={styles.field}>
                    <span>Nombre del producto</span>
                    <input type='text' placeholder='Ej. Pack colaborativo' />
                </label>
                <label className={styles.field}>
                    <span>Colaborador</span>
                    <input type='text' placeholder='Nombre del partner' />
                </label>
                <label className={styles.field}>
                    <span>Notas</span>
                    <textarea
                        rows={4}
                        placeholder='Compartir detalles de la colaboración'
                    />
                </label>
                <button type='button' className={styles.secondaryButton}>
                    Crear colaboración
                </button>
            </form>
        </section>
    );
}
