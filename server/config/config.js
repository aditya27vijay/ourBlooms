import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    username: null,
    password: null,
    database: null,
    host: null,
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
    logging: console.log,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: null,
    password: null,
    database: null,
    host: null,
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: null,
    password: null,
    database: null,
    host: null,
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};