import axios from 'axios';
import * as API from '../api/index';

export const fetchItemById = async (id) => {
  const { data } = await API.fetchItemById(id);

  return data;
};
