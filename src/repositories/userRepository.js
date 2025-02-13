const { poolPromise, sql } = require('../config/db');
const User = require('../models/userModel');

class UserRepository {
  async createUser(name, email, password) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('Name', sql.VarChar, name)
        .input('Email', sql.VarChar, email)
        .input('Password', sql.VarChar, password)
        .query(`
          INSERT INTO Users (Name, Email, Password)
          VALUES (@Name, @Email, @Password);
          SELECT SCOPE_IDENTITY() AS id;
        `);
      const id = result.recordset[0].id;
      return new User(id, name, email, password);
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('Email', sql.VarChar, email)
        .query('SELECT * FROM Users WHERE Email = @Email');
      if (result.recordset.length > 0) {
        const user = result.recordset[0];
        return new User(user.id, user.Name, user.Email, user.Password);
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();