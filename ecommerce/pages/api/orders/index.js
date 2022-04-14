import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import Order from '../../../models/Order';
import { onError } from '../../../utils/errors';

const handler = nc({
  onError: onError,
});

handler.use(isAuth);

handler.post(async (req, res) => {
  const orderData = { ...req.body };
  console.log(`user in /api/orders : ${req.user}`);

  await db.connect();

  const newOrder = new Order({
    ...orderData,
    user: req.user._id,
  });

  const order = await newOrder.save();

  await db.disconnect();

  res.status(201).send(order);
});

export default handler;
