import axios from "axios";

export const getHechos = async () => axios.get("http://localhost:3000/hechos");

export const getFallas = async () => axios.get("http://localhost:3000/fallas");

export const getHechosFallas = async () =>
  axios.get("http://localhost:3000/hechos_fallas");

export const postRule = async (data: any) =>
  axios.post("http://localhost:3000/newRule", data);

export const createHecho = async (nombre: string, valor_posible: string) => {
  const response = await fetch(`http://localhost:3000/hechos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, valor_posible }),
  });
  return response.json();
};

export const getPreferencias = async (usuario_id: number, falla_ids: number[]) => {
  const fallaIdsParam = falla_ids.join(',');
  const response = await fetch(
    `http://localhost:3000/preferencias?usuario_id=${usuario_id}&falla_ids=${fallaIdsParam}`
  );
  return response.json();
};

export const createPreferencia = async (data: {
  usuario_id: number;
  hecho_clima_id: number;
  hecho_ocasion_id: number;
  hecho_estilo_id: number;
  falla_id: number;
}) => {
  const response = await fetch(`http://localhost:3000/preferencias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getHistorialPreferencias = async (usuario_id: number) => {
  const response = await fetch(
    `http://localhost:3000/preferencias/historial/${usuario_id}`
  );
  return response.json();
};