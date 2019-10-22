exports.up = function(knex) {
    return knex.schema.createTable('patient-login', tbl => {
        tbl.increments();
        tbl.string('phoneNumber', 128).notNullable();
        tbl.string('clientId', 128).notNullable();
        tbl.string('loginTime', 500);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('patient-login');
};
