const userValidator = require('../validators/userValidator');

describe('UserValidator', () => {
  describe('validateRegistration', () => {
    it('should return no errors for valid input', () => {
      const data = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };
      const errors = userValidator.validateRegistration(data);
      expect(errors).toHaveLength(0);
    });

    it('should return error if name is missing', () => {
      const data = {
        name: '',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };
      const errors = userValidator.validateRegistration(data);
      expect(errors).toContain('Nome é obrigatório');
    });

    it('should return error if email is missing', () => {
      const data = {
        name: 'John Doe',
        email: '',
        password: 'password123',
        confirmPassword: 'password123'
      };
      const errors = userValidator.validateRegistration(data);
      expect(errors).toContain('Email é obrigatório');
    });

    it('should return error if email is invalid', () => {
      const data = {
        name: 'John Doe',
        email: 'invalidemail',
        password: 'password123',
        confirmPassword: 'password123'
      };
      const errors = userValidator.validateRegistration(data);
      expect(errors).toContain('Email inválido');
    });

    it('should return error if password is missing', () => {
      const data = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '',
        confirmPassword: 'password123'
      };
      const errors = userValidator.validateRegistration(data);
      expect(errors).toContain('Senha é obrigatória');
    });

    it('should return error if confirmPassword is missing', () => {
      const data = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: ''
      };
      const errors = userValidator.validateRegistration(data);
      expect(errors).toContain('Confirmação de senha é obrigatória');
    });

    it('should return error if passwords do not match', () => {
      const data = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'password456'
      };
      const errors = userValidator.validateRegistration(data);
      expect(errors).toContain('As senhas não coincidem');
    });
  });
});