import nc from 'next-connect';
import db from '../../../../utils/db';
import { isAuth } from '../../../../utils/auth';
import Order from '../../../../models/Order';
import { onError } from '../../../../utils/errors';

const handler = nc({
  onError,
});

handler.use(isAuth);

handler.put(async (req, res) => {
  const { id } = req.query;
  await db.connect();
  const order = await Order.findById(id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    res.send({
      message: 'Order paid',
      order: paidOrder,
    });
    await db.disconnect();
  } else {
    await db.disconnect();
    res.status(404).send({
      message: 'Order not found',
    });
  }
});

export default handler;
