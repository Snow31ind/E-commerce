import nc from 'next-connect';

const handler = nc();

handler.get(async (req, res) => {
  res.status(200).send({ message: 'API connected' });
});

export default handler;
