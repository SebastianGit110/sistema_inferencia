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