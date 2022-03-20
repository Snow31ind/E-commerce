import nc from 'next-connect';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import Order from '../../../../models/Order';

const handler = nc();

handler.use(isAuth);

handler.get(async (req, res) => {
  const { id } = req.query;
  console.log(id);
  await db.connect();
  const order = await Order.findById(id);
  await db.disconnect();

  // res.status(401).send({ message: `Order with id ${id} not found` });

  console.log(order);

  if (!order) {
    res.status(401).send({ message: `Order with id ${id} not found` });
  }

  res.status(200).send(order);
});

export default handler;
