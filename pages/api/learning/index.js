import nc from 'next-connect';
import db from '../../../utils/db';
import Product from '../../../models/Product';
import Order from '../../../models/Order';
import User from '../../../models/User';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  const x = await Product.find({
    countInStock: {
      $gt: 50,
    },
  }).countDocuments();

  const y = await Product.find(
    {
      $and: [
        {
          brand: {
            $in: ['HP', 'Lenovo'],
          },
        },
        {
          price: {
            $gt: 10000000,
            $lt: 20000000,
          },
        },
      ],
    },
    {
      price: 1,
      brand: 1,
    }
  );

  await db.disconnect();

  res.send({ x, y });
});

export default handler;
