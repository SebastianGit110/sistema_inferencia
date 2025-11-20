// controllers/userController.js
import pool from '../db.js';
import bcrypt from 'bcryptjs';

// Helpers
const emailIsValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const logSqlError = (err) => {
  console.error('❌ SQL ERROR:', err.code, err.errno, err.sqlMessage || err.message);
};

// ================= GET all users =================
export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id, 
        u.nombre, 
        u.email, 
        r.nombre AS rol, 
        DATE_FORMAT(u.fecha_creacion, '%Y-%m-%d') AS fecha_creacion
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      ORDER BY u.fecha_creacion DESC
    `);
    res.json(rows);
  } catch (err) {
    logSqlError(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// ================ GET user by id =================
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id, 
        u.nombre, 
        u.email, 
        r.nombre AS rol,
        u.rol_id,
        DATE_FORMAT(u.fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    logSqlError(err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// ================ CREATE user ====================
export const createUser = async (req, res) => {
  const { nombre, email, password, rol = 'usuario' } = req.body || {};

  // Validaciones tempranas
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  if (!emailIsValid(email)) return res.status(400).json({ error: 'Email no válido' });
  if (String(password).length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

  try {
    // Verificar si existe email
    const [existingUsers] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Buscar id del rol (fallar si no existe)
    const [rolRow] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [rol]);
    if (rolRow.length === 0) {
      return res.status(400).json({ error: `Rol no válido: ${rol}` });
    }
    const rolId = rolRow[0].id;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rolId]
    );

    // Recuperar y devolver usuario creado
    const [newUser] = await pool.query(`
      SELECT 
        u.id, 
        u.nombre, 
        u.email, 
        r.nombre AS rol,
        DATE_FORMAT(u.fecha_creacion, '%Y-%m-%d') AS fecha_creacion
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `, [result.insertId]);

    res.status(201).json(newUser[0]);
  } catch (err) {
    logSqlError(err);
    // Manejo específico si hay restricción única en BD
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya está registrado (DB)' });
    }
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// ================ UPDATE user (PUT) ============
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol } = req.body || {};

  try {
    // Existe usuario?
    const [userRow] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (userRow.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Si viene email, validar y verificar uniqueness
    if (email) {
      if (!emailIsValid(email)) return res.status(400).json({ error: 'Email no válido' });

      const [existingEmail] = await pool.query('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, id]);
      if (existingEmail.length > 0) return res.status(400).json({ error: 'El email ya está en uso' });
    }

    // Armamos update dinámico
    const updateFields = [];
    const updateVals = [];

    if (nombre) { updateFields.push('nombre = ?'); updateVals.push(nombre); }
    if (email)  { updateFields.push('email = ?'); updateVals.push(email); }

    if (password) {
      if (String(password).length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      const hashed = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      updateVals.push(hashed);
    }

    if (rol) {
      const [rolRow] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [rol]);
      if (rolRow.length === 0) return res.status(400).json({ error: 'Rol no válido' });
      updateFields.push('rol_id = ?');
      updateVals.push(rolRow[0].id);
    }

    if (updateFields.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

    updateVals.push(id); // para el WHERE
    const sql = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.query(sql, updateVals);

    // Devolvemos usuario actualizado
    const [updatedUser] = await pool.query(`
      SELECT 
        u.id, 
        u.nombre, 
        u.email, 
        r.nombre AS rol,
        DATE_FORMAT(u.fecha_creacion, '%Y-%m-%d') AS fecha_creacion
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `, [id]);

    res.json(updatedUser[0]);
  } catch (err) {
    logSqlError(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya está en uso (DB)' });
    }
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// ================ PATCH update role =================
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body || {};

  if (!rol) return res.status(400).json({ error: 'El rol es obligatorio' });

  try {
    const [user] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (user.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const [rolRow] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [rol]);
    if (rolRow.length === 0) return res.status(400).json({ error: 'Rol no válido' });

    await pool.query('UPDATE usuarios SET rol_id = ? WHERE id = ?', [rolRow[0].id, id]);

    res.json({ message: 'Rol actualizado correctamente', id: parseInt(id), rol });
  } catch (err) {
    logSqlError(err);
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
};

// ================ DELETE user =================
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await pool.query('SELECT id, nombre FROM usuarios WHERE id = ?', [id]);
    if (user.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado correctamente', id: parseInt(id), nombre: user[0].nombre });
  } catch (err) {
    logSqlError(err);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'No se puede eliminar el usuario porque tiene datos relacionados' });
    }
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
