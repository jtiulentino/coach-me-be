exports.up = function(knex) {
    return knex.schema
        .createTable('patient-login', tbl => {
            tbl.increments();
            tbl.string('phoneNumber', 128).notNullable();
            tbl.string('clientId', 128).notNullable();
            tbl.string('loginTime', 500);
        })
        .createTable('users', tbl => {
            tbl.uuid('userId').primary();
            tbl.string('role', 255);
            tbl.string('userPhone', 255).notNullable();
        })
        .createTable('coaches', tbl => {
            tbl.uuid('coachId').primary();
            tbl.string('coachName', 255).notNullable();
            tbl.string('userId')
                .notNullable()
                .unsigned()
                .references('userId')
                .inTable('users')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        })
        .createTable('patients', tbl => {
            tbl.uuid('patientId').primary();
            tbl.string('userId')
                .notNullable()
                .unsigned()
                .references('userId')
                .inTable('users')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            tbl.string('coachId', 255)
                .notNullable()
                .unsigned()
                .references('coachId')
                .inTable('coaches')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            tbl.string('patientName', 255);
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('patients')
        .dropTableIfExists('coaches')
        .dropTableIfExists('users')
        .dropTableIfExists('patient-login');
};
