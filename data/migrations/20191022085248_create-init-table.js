exports.up = function(knex) {
    return knex.schema
        .createTable('patient-login', tbl => {
            tbl.increments();
            tbl.string('phoneNumber', 128);
            tbl.string('clientId', 128);
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
            tbl.string('email', 255)
                .unique()
                .notNullable();
            tbl.string('password', 255).notNullable();
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
        })
        .createTable('conversations', tbl => {
            tbl.uuid('conversationId').primary();
            tbl.string('coachId')
                .notNullable()
                .unsigned()
                .references('coachId')
                .inTable('coaches')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            tbl.string('patientId')
                .notNullable()
                .unsigned()
                .references('patientId')
                .inTable('patients')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            tbl.string('createdDate', 255);
        })
        .createTable('messageHistory', tbl => {
            tbl.uuid('messageId').primary();
            tbl.string('conversationId')
                .notNullable()
                .unsigned()
                .references('conversationId')
                .inTable('conversations')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            tbl.string('createdDate', 255);
            tbl.string('textContent');
            tbl.string('senderId')
                .notNullable()
                .unsigned()
                .references('userId')
                .inTable('users')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        })
        .createTable('scheduledMessages', tbl => {
            tbl.uuid('scheduleId').primary();
            tbl.string('patientId')
                .notNullable()
                .unsigned()
                .references('patientId')
                .inTable('patients')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            tbl.string('min');
            tbl.string('hour');
            tbl.string('weekday');
            tbl.string('dom');
            tbl.string('month');
            tbl.string('year');
            tbl.string('ampm');
            tbl.text('msg');
        })
        .createTable('recoveries', tbl => {
            tbl.uuid('recoverId').primary();
            tbl.string('coachId')
                .notNullable()
                .unsigned()
                .references('coachId')
                .inTable('coaches')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            tbl.string('resetPasswordToken');
            tbl.string('resetPasswordExpires');
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('recoveries')
        .dropTableIfExists('scheduledMessages')
        .dropTableIfExists('messageHistory')
        .dropTableIfExists('conversations')
        .dropTableIfExists('patients')
        .dropTableIfExists('coaches')
        .dropTableIfExists('users')
        .dropTableIfExists('patient-login');
};
