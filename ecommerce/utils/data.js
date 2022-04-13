import bcrypt from 'bcryptjs';
import { randomInteger, randomRating, slugify } from './helpers';

const data = require('./data1.json');

const products = data.products.map((product) => ({
  ...product,
  slug: slugify(product.name),
  numReviews: randomInteger(5, 100),
  countInStock: randomInteger(10, 100),
  rating: randomRating(),
}));

const users = [
  {
    name: 'Li Quang Tien',
    birth: new Date(2001, 0, 15),
    gender: 'male',
    address:
      '163 Trinh Dinh Trong street, Phu Trung ward, Tan Phu district, Ho Chi Minh city',
    phoneNumber: '0789130657',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('159753'),
    isAdmin: true,
  },
  {
    name: 'Sample user 1',
    birth: new Date(2002, 3, 7),
    gender: 'female',
    address: '46 Dong Da, Ha Noi',
    phoneNumber: '0791647283',
    email: 'user1@gmail.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: false,
  },
];

export { users, products };
