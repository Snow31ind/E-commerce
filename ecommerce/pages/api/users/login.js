import nc from 'next-connect';
import db from '../../../utils/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  await db.connect();

  const user = await User.findOne({ email: email }).lean();

  await db.disconnect();

  console.log(user);
  console.log(bcrypt.compareSync(password, user.password));

  if (user && bcrypt.compareSync(password, user.password)) {
    console.log('Email and password found match');

    const token = signToken(user);

    console.log(token);

    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
});

export default handler;
