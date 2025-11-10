import pool from '../db.js'; // si usaste export default

export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, fecha_creacion FROM usuarios'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};
