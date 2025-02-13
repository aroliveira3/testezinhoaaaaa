const userRepository = require('../repositories/userRepository');
const User = require('../models/userModel');

class UserService {
  async registerUser(name, email, password) {
    // Verificar se o usuário já existe
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Aqui você deve adicionar o hash da senha em uma implementação real
    const newUser = await userRepository.createUser(name, email, password);
    return newUser;
  }
}

module.exports = new UserService();