import nc from 'next-connect';
import Product from '../../models/Product';
import User from '../../models/User';
import { products, users } from '../../utils/data';
import db from '../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  await Product.deleteMany();
  await Product.insertMany(products);

  await User.deleteMany();
  await User.insertMany(users);

  await db.disconnect();

  res.send({
    message: 'Seeded successfully',
  });
});

export default handler;
