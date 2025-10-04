const jwt = require('jsonwebtoken');
const JWT_SECRET = require('dotenv').config().parsed.JWT_SECRET;
const UserModel = require('../models/UserModel.js');

export default class AuthService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  createAuthToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
  }

  async register(data) {
    try {
      const user = await User.create(data);
      if (!user) {
        throw new HttpException(httpStatus.BadRequest, 'Bad request');
      }
      user.token = this.createAuthToken({ id: user.id, email: user.email });
      return user;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(httpStatus.BadRequest, 'Bad request', error.errors[0]);
      } else {
        throw new HttpException(error.message);
      }
    }
  }

  async login(email, password){
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
    throw new HttpException(httpStatus.Unauthorized, 'Invalid credentials');
    }
    user.token = this.createAuthToken({ id: user.id, email: user.email });
    return user;
  }
}