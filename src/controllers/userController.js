const userService = require('../services/userService');

class UserController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await userService.registerUser(name, email, password);
      res.status(201).json({ message: 'Cadastro realizado com sucesso', user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();