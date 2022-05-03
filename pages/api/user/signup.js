import nc from 'next-connect';
import db from '../../../utils/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  await db.connect();

  const existUser = await User.findOne({ email: email });

  if (existUser) {
    res
      .status(401)
      .send({ message: 'This email has already been registered.' });
  }

  const newUser = new User({
    ...req.body,
    password: bcrypt.hashSync(password),
  });

  const user = await newUser.save();
  console.log('x');

  await db.disconnect();

  const token = signToken(user);

  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
