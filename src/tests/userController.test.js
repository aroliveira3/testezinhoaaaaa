const request = require('supertest');
const app = require('../app');
const userService = require('../services/userService');

jest.mock('../services/userService');

describe('UserController', () => {
  describe('POST /api/users/register', () => {
    it('deve retornar 201 e mensagem de sucesso quando o cadastro for bem-sucedido', async () => {
      userService.registerUser.mockResolvedValue({ id: 1, name: 'Test', email: 'test@example.com', password: 'hashedpassword' });

      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test',
          email: 'test@example.com',
          password: 'password',
          confirmPassword: 'password'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'Cadastro realizado com sucesso');
      expect(res.body).toHaveProperty('user');
    });

    it('deve retornar 400 e mensagens de erro quando os dados forem inválidos', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: '',
          email: 'invalidemail',
          password: 'password',
          confirmPassword: 'differentpassword'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toContain('Nome é obrigatório');
      expect(res.body.errors).toContain('Email inválido');
      expect(res.body.errors).toContain('As senhas não coincidem');
    });
  });
});