import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";

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
    name: "sample name",
    slug: "sample-slug-" + Math.random(),
    images: ["/default_laptop.png"],
    category: "sample category",
    brand: "sample brand",
    oldPrice: 1000000,
    price: 100000,
    processorAndMemory: {
      processorName: "Core i",
      processorVariant: "sample(1135G7)",
      ram: 0,
      ssd: "Not available",
      ssdCapacity: 0,
      graphicProcessor: "sample(Intel Integrated Iris Xe)",
    },
    dimensions: {
      weight: 0,
    },
    displayAndAudio: {
      screenSize: "sample(33.02 cm (13 inch))",
    },
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: "Product Created Successfully!", product });
});

export default handler;
