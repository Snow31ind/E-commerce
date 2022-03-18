import bcryptjs from 'bcryptjs';

const data = require('./data.json');

const users = [
  {
    name: 'Li Quang Tien',
    birth: new Date(2001, 0, 15),
    gender: 'male',
    address:
      '163 Trinh Dinh Trong street, Phu Trung ward, Tan Phu district, Ho Chi Minh city',
    phoneNumber: '0789130657',
    email: 'admin@gmail.com',
    password: bcryptjs.hashSync('159753'),
    isAdmin: true,
  },
  {
    name: 'Sample user 1',
    birth: new Date(2002, 3, 7),
    gender: 'female',
    address: '46 Dong Da, Ha Noi',
    phoneNumber: '0791647283',
    email: 'user1@gmail.com',
    password: bcryptjs.hashSync('123456'),
    isAdmin: false,
  },
];

export { data, users };
