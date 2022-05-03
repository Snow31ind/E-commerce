import nc from 'next-connect';
import Product from '../../../../../models/Product';
import { isAuth, isAdmin } from '../../../../../utils/auth';
import db from '../../../../../utils/db';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
  const { id } = req.query;
  const data = { ...req.body };

  db.connect();

  await Product.findByIdAndUpdate(id, { ...data });

  db.disconnect();

  res.status(201).send({ message: `Update product ${id} successsfully` });
});

export default handler;
