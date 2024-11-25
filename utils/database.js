import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('auth.db');

const createTable = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        );`,
        [],
        () => {
          console.log('Users table created or already exists');
          resolve();
        },
        (_, error) => {
          console.error('Error creating table:', error);
          reject(error);
        }
      );
    });
  });
};

export const initDatabase = async () => {
  try {
    await createTable(); // Ensure the table is created
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const registerUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (username, password) VALUES (?, ?);',
        [username, password],
        (_, result) => {
          console.log('User registered successfully');
          resolve(result);
        },
        (_, error) => {
          console.error('Error registering user:', error);
          reject(error);
        }
      );
    });
  });
};

export const loginUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE username = ? AND password = ?;',
        [username, password],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            console.log('Login successful');
            resolve(true);
          } else {
            console.log('Invalid username or password');
            resolve(false);
          }
        },
        (_, error) => {
          console.error('Error during login:', error);
          reject(error);
        }
      );
    });
  });
};
