const userRepository = require('../repositories/userRepository');
const { poolPromise, sql } = require('../config/db');
const User = require('../models/userModel');

describe('UserRepository', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return the user object', async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [{ id: 1 }] })
      };
      poolPromise.mockResolvedValue({ request: () => mockRequest });

      const user = await userRepository.createUser('John Doe', 'john.doe@example.com', 'password123');

      expect(poolPromise).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith('Name', sql.VarChar, 'John Doe');
      expect(mockRequest.input).toHaveBeenCalledWith('Email', sql.VarChar, 'john.doe@example.com');
      expect(mockRequest.input).toHaveBeenCalledWith('Password', sql.VarChar, 'password123');
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO Users'));
      expect(user).toBeInstanceOf(User);
      expect(user).toEqual(new User(1, 'John Doe', 'john.doe@example.com', 'password123'));
    });

    it('should throw an error if the database query fails', async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error('DB Error'))
      };
      poolPromise.mockResolvedValue({ request: () => mockRequest });

      await expect(userRepository.createUser('John Doe', 'john.doe@example.com', 'password123')).rejects.toThrow('DB Error');
      expect(poolPromise).toHaveBeenCalled();
      expect(mockRequest.query).toHaveBeenCalled();
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user if found', async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [{ id: 1, Name: 'John Doe', Email: 'john.doe@example.com', Password: 'hashedpassword' }] })
      };
      poolPromise.mockResolvedValue({ request: () => mockRequest });

      const user = await userRepository.findUserByEmail('john.doe@example.com');

      expect(poolPromise).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith('Email', sql.VarChar, 'john.doe@example.com');
      expect(mockRequest.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE Email = @Email');
      expect(user).toBeInstanceOf(User);
      expect(user).toEqual(new User(1, 'John Doe', 'john.doe@example.com', 'hashedpassword'));
    });

    it('should return null if user is not found', async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [] })
      };
      poolPromise.mockResolvedValue({ request: () => mockRequest });

      const user = await userRepository.findUserByEmail('nonexistent@example.com');

      expect(poolPromise).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith('Email', sql.VarChar, 'nonexistent@example.com');
      expect(mockRequest.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE Email = @Email');
      expect(user).toBeNull();
    });

    it('should throw an error if the database query fails', async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error('DB Error'))
      };
      poolPromise.mockResolvedValue({ request: () => mockRequest });

      await expect(userRepository.findUserByEmail('john.doe@example.com')).rejects.toThrow('DB Error');
      expect(poolPromise).toHaveBeenCalled();
      expect(mockRequest.query).toHaveBeenCalled();
    });
  });
});