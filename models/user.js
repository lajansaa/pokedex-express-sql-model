const bcrypt = require('bcrypt');

/**
 * ===========================================
 * Export model functions as a module
 * ===========================================
 */
module.exports = (dbPool) => {
  // `dbPool` is accessible within this function scope
  return {
    create: (user, callback) => {
      // run user input password through bcrypt to obtain hashed password
      bcrypt.hash(user.password, 1, (err, hashed) => {
        if (err) console.error('error!', err);

        // set up query
        const queryString = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
        const values = [
          user.name,
          user.email,
          hashed
        ];

        // execute query
        dbPool.query(queryString, values, (error, queryResult) => {
          // invoke callback function with results after query has executed
          callback(error, queryResult);
        });
      });
    },

    get: (id, callback) => {
      // set up query
      const queryString = 'SELECT * FROM users WHERE id=$1';
      const values = [id];

      // execute query
      dbPool.query(queryString, values, (error, queryResult) => {
        // invoke callback function with results after query has executed
        callback(error, queryResult);
      });
    },

    login: (user, callback) => {
      // set up query
      const queryString = `SELECT * FROM users WHERE name='${user.name}'`;

      // execute query
      dbPool.query(queryString, (error, queryResult) => {
        bcrypt.compare(user.password, queryResult.rows[0].password, (err, res) => {
          // invoke callback function with results after query has executed
          callback(error, {"status": res, "user_id": queryResult.rows[0].id});
        });
      });
    },

    userAccount: (userId, callback) => {
      const queryString = `SELECT DISTINCT
                               U.name,
                               U.email,
                               P.name AS pokemon_name
                           FROM users U
                           JOIN user_pokemons UP ON U.id = UP.user_id
                           JOIN pokemons P ON UP.pokemon_id = P.id
                           WHERE U.id=${userId};`;

      // execute query
      dbPool.query(queryString, (error, queryResult) => {
        callback(error, queryResult.rows);
      });
    }
  };
};
