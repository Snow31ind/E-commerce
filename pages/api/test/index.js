import nc from 'next-connect';
import db from '../../../utils/db';
import Product from '../../../models/Product';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  const uniqueBrands = await Product.find().distinct('brand');
  const uniqueCPUs = await Product.find().distinct(
    'processorAndMemory.processorName'
  );
  const uniqueRAMs = await Product.find().distinct('processorAndMemory.ram');
  const uniqueGPUs = await Product.find().distinct(
    'processorAndMemory.graphicProcessor'
  );
  const uniqueScreenSizes = await Product.find().distinct(
    'displayAndAudio.screenSize'
  );
  const uniqueWeights = await Product.find().distinct('dimensions.weight');
  res.status(200).send({
    uniqueBrands,
    uniqueCPUs,
    uniqueGPUs,
    uniqueRAMs,
    uniqueScreenSizes,
    uniqueWeights,
  });

  await db.disconnect();
});

export default handler;
