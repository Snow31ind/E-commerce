import axios from 'axios';

export const fetchItemById = async (id) => {
  const { data } = await axios.get(`api/products/${id}`);

  return data;
};
