import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Product from '../../../../../models/Product';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.category = req.body.category;
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.images = req.body.images;
    product.brand = req.body.brand;
    product.oldPrice = req.body.oldPrice;
    product.price = req.body.price;
    product.countInStock = req.body.countInStock;
    product.processorAndMemory = {
      processorName: req.body.processorName,
      processorVariant: req.body.processorVariant,
      ram: req.body.ram,
      ssd: req.body.ssd,
      ssdCapacity: req.body.ssdCapacity,
      graphicProcessor: req.body.graphicProcessor,
    };
    product.dimensions = {
      weight: req.body.weight,
    };
    product.displayAndAudio = {
      screenSize: req.body.screenSize,
    };
    await product.save();
    await db.disconnect();
    res.send({ message: 'Product Updated Successfully!' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found!' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: 'Product Deleted Successfully!' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found!' });
  }
});

export default handler;
