import axios from 'axios';

export const signIn = async (user) => {
  const { data } = await axios.post('api/user/signin', user);

  return data;
};

export const signUp = async (user) => {
  const { data } = await axios.post('api/user/signup', user);
  console.log(data);

  return data;
};
