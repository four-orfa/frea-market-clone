module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  // Compiled JavaScript is used. ("ts" is not used.)
  entities: ['dist/src/entities/*.entity.js'],
  migrations: ['dist/src/migrations/*.js'],
  cli: {
    entitiesDir: 'src/entities/',
    migrationsDir: 'src/migrations/',
  },
};
