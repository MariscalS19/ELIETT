import styles from './inventory.module.css';
export default function InventoryPage() {
    return (
        <section className={styles.panel}>
            <div className={styles.panelHeader}>
                <h2>Agregar producto</h2>
                <span>Sube un producto nuevo al catálogo</span>
            </div>

            <form className={styles.form}>
                <label className={styles.field}>
                    <span>Nombre</span>
                    <input type='text' placeholder='Ej. Sudadera negra' />
                </label>
                <label className={styles.field}>
                    <span>Categoría</span>
                    <input type='text' placeholder='Ej. Ropa' />
                </label>
                <label className={styles.field}>
                    <span>Precio</span>
                    <input type='number' placeholder='0.00' />
                </label>
                <label className={styles.field}>
                    <span>Descripción</span>
                    <textarea
                        rows={4}
                        placeholder='Describe las ventajas del producto'
                    />
                </label>
                <button type='button' className={styles.primaryButton}>
                    Guardar producto
                </button>
            </form>
        </section>
    );
}
