import nc from 'next-connect';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  // const productId = req.query.id;

  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();

  if (!product) {
    res.status(401).send({ message: 'The product does not exist' });
  }

  res.send(product);
});

export default handler;
