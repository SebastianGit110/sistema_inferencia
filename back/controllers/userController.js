// controllers/userController.js
import pool from '../db.js';

export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id, 
        u.nombre, 
        u.email, 
        r.nombre AS rol, 
        u.fecha_creacion
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
    `);

    res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};



// === Cambiar el rol de un usuario ===
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  try {
    // Buscar ID del rol por nombre
    const [rolRow] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [rol]);
    if (rolRow.length === 0) {
      return res.status(400).json({ error: 'Rol no válido' });
    }

    const rolId = rolRow[0].id;
    await pool.query('UPDATE usuarios SET rol_id = ? WHERE id = ?', [rolId, id]);
    res.json({ message: 'Rol actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar rol:', err);
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
};

// === Eliminar usuario ===
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar usuario:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};