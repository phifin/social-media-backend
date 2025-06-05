import User from '../Models/user.js';
import PrivacyUser from '../Models/privacyUser.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const AuthController = {
  register: async (req, res) => {
    try {
      const { email, password, username } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      const user = new User({ email, password, username });
      await user.save(); 
  
      const privacyUser = new PrivacyUser({ userId: user._id });
      await privacyUser.save(); 
  
      const token = generateToken(user._id);
      res.status(201).json({
        user: { ...user._doc, password: undefined },
        token,
      });
    } catch (err) {
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  },
  

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = generateToken(user._id);
      res.json({ user: { ...user._doc, password: undefined }, token });
    } catch (err) {
      res.status(500).json({ message: 'Login failed', error: err.message });
    }
  },
};

export default AuthController;
