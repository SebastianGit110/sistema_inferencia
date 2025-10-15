export const getUsers = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users');
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return await response.json();
  } catch (err) {
    console.error('❌ Error obteniendo usuarios:', err);
    return [];
  }
};
