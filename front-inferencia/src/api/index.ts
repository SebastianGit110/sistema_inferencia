import axios from "axios";

export const getHechos = async () => axios.get("http://localhost:3000/hechos");

export const getFallas = async () => axios.get("http://localhost:3000/fallas");

export const getHechosFallas = async () =>
  axios.get("http://localhost:3000/hechos_fallas");
