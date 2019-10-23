const uuidv4 = require('uuid/v4');

exports.seed = function(knex) {
    return knex('users').insert([
        { userId: uuidv4(), role: 'coach', userPhone: '5097204080' }
    ]);
};
