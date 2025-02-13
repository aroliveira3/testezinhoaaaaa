const errorHandler = require('../middleware/errorHandler');

describe('ErrorHandler Middleware', () => {
  it('should log the error and send a 500 response with error message', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Test Error');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    errorHandler(mockError, req, res, next);

    expect(consoleSpy).toHaveBeenCalledWith(mockError.stack);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Test Error' });

    consoleSpy.mockRestore();
  });

  it('should use default error message if error message is not provided', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = {};
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    errorHandler(mockError, req, res, next);

    expect(consoleSpy).toHaveBeenCalledWith(mockError.stack);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });

    consoleSpy.mockRestore();
  });
});