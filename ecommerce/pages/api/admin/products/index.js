import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'sample name',
    slug: 'sample-slug-' + Math.random(),
    price: 1940000,
    images: ['/default_laptop.png'],
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    rating: 0,
    numReviews: 0,
    processorAndMemoryFeatures: {
      cache: '8MB',
      clockSpeed: '2.4 GHz with Turbo Boost Upto 4.2 GHz',
      graphicProcessor: 'Intel Integrated Iris Xe',
      processorBrand: 'Intel',
      processorGeneration: '11th Gen',
      processorName: 'Core i5',
      processorVariant: '1135G7',
      ram: '16 GB',
      ramType: 'DDR4',
      ssd: 'Yes',
      ssdCapacity: '512 GB',
    },
    dimensions: {
      dimensions: '299 x 210 x 14.9 mm',
      weight: 1.26,
    },
    displayAndAudioFeatures: {
      screenResolution: '2560 x 1600 Pixel',
      screenSize: '33.02 cm (13 inch)',
      screenType: 'WQXGA IPS Anti-glare Display',
      touchscreen: 'Not available',
    },
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product Created Successfully!', product });
});

export default handler;
