import nc from 'next-connect';
import Product from '../../../../../models/Product';
import { isAuth, isAdmin } from '../../../../../utils/auth';
import db from '../../../../../utils/db';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
  const { id } = req.query;

  db.connect();

  // await Product.findByIdAndUpdate(id);
  await Product.findByIdAndRemove(id);

  db.disconnect();

  res.status(201).send({ message: `Remove product ${id} successsfully` });
});

export default handler;
