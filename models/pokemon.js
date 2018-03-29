/**
 * ===========================================
 * Export model functions as a module
 * ===========================================
 */
module.exports = (dbPool) => {
  // `dbPool` is accessible within this function scope
  return {
    create: (pokemon, callback) => {
      
      const insertPokemonString = `INSERT INTO pokemons (name, num, img, weight, height) VALUES ('${pokemon.name}', '${pokemon.num}', '${pokemon.img}', '${pokemon.weight}', '${pokemon.height}') RETURNING id`;
      dbPool.query(insertPokemonString, (err, res) => {
          const insertUserPokemonsString = `INSERT INTO user_pokemons (pokemon_id, user_id) VALUES (${res.rows[0].id}, ${pokemon.user_id})`;
          dbPool.query(insertUserPokemonsString, (error, queryResult) => {
              callback(error, queryResult);
          });
      });
    },

    get: (id, callback) => {
      const values = [id];

      dbPool.query('SELECT * from pokemons WHERE id=$1', values, (error, queryResult) => {
        callback(error, queryResult);
      });
    }
  };
};
