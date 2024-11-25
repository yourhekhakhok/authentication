import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('authentication.db');

const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    database.transaction((txn) => {
      txn.executeSql(
        query,
        params,
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `;
  try {
    await executeQuery(createTableQuery);
    console.log('Users table created or already exists.');
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
};

export const initializeDatabase = async () => {
  try {
    await createUsersTable();
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const createUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required.');
  }

  const insertQuery = `
    INSERT INTO users (username, password) VALUES (?, ?);
  `;
  
  try {
    const result = await executeQuery(insertQuery, [username, password]);
    console.log('User registered successfully');
    return result;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const authenticateUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required for login.');
  }

  const loginQuery = `
    SELECT * FROM users WHERE username = ? AND password = ?;
  `;
  
  try {
    const { rows: { _array } } = await executeQuery(loginQuery, [username, password]);
    return _array.length > 0; // Return true if user is found, false otherwise
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};
