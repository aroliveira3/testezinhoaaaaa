const userService = require('../services/userService');
const userRepository = require('../repositories/userRepository');

jest.mock('../repositories/userRepository');

describe('UserService', () => {
  describe('registerUser', () => {
    it('deve registrar usuário com sucesso', async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);
      userRepository.createUser.mockResolvedValue({ id: 1, name: 'Test', email: 'test@example.com', password: 'hashedpassword' });

      const user = await userService.registerUser('Test', 'test@example.com', 'password');

      expect(user).toEqual({ id: 1, name: 'Test', email: 'test@example.com', password: 'hashedpassword' });
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(userRepository.createUser).toHaveBeenCalledWith('Test', 'test@example.com', 'password');
    });

    it('deve lançar erro se email já existir', async () => {
      userRepository.findUserByEmail.mockResolvedValue({ id: 1, name: 'Existing User', email: 'test@example.com', password: 'hashedpassword' });

      await expect(userService.registerUser('Test', 'test@example.com', 'password')).rejects.toThrow('Email já está em uso');
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });
  });
});