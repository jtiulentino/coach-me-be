exports.up = function(knex) {
  return knex.schema
    .createTable("patient-login", tbl => {
      tbl.increments();
      tbl.string("phoneNumber", 128);
      tbl.string("clientId", 128);
      tbl.string("loginTime", 500);
    })
    .createTable("users", tbl => {
      tbl.uuid("id").primary();
      tbl.string("role", 255);
      tbl.string("userPhone", 255).notNullable();
    })
    .createTable("coaches", tbl => {
      tbl.uuid("coachId").primary();
      tbl.string("coachName", 255).notNullable();
      tbl
        .string("email", 255)
        .unique()
        .notNullable();
      tbl.string("password", 255).notNullable();
      tbl
        .uuid("userId")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("patients", tbl => {
      tbl.uuid("patientId").primary();
      tbl
        .uuid("userId")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .uuid("coachId", 255)
        .notNullable()
        .unsigned()
        .references("coachId")
        .inTable("coaches")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("patientName", 255);
    })
    .createTable("conversations", tbl => {
      tbl.uuid("conversationId").primary();
      tbl
        .uuid("coachId")
        .notNullable()
        .unsigned()
        .references("coachId")
        .inTable("coaches")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .uuid("patientId")
        .notNullable()
        .unsigned()
        .references("patientId")
        .inTable("patients")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("createdDate", 255);
    })
    .createTable("messageHistory", tbl => {
      tbl.uuid("messageId").primary();
      tbl
        .uuid("conversationId")
        .notNullable()
        .unsigned()
        .references("conversationId")
        .inTable("conversations")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("createdDate", 255);
      tbl.string("textContent");
      tbl
        .uuid("senderId")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("scheduledMessages", tbl => {
      tbl.uuid("scheduleId").primary();
      tbl
        .uuid("patientId")
        .notNullable()
        .unsigned()
        .references("patientId")
        .inTable("patients")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.integer("sec");
      tbl.integer("min");
      tbl.integer("hour");
      tbl.integer("dom");
      tbl.integer("month");
      tbl.integer("weekday");
      tbl.text("msg");
    })
    .createTable("recoveries", tbl => {
      tbl.uuid("recoverId").primary();
      tbl
        .uuid("coachId")
        .notNullable()
        .unsigned()
        .references("coachId")
        .inTable("coaches")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("resetPasswordToken");
      tbl.string("resetPasswordExpires");
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("recoveries")
    .dropTableIfExists("scheduledMessages")
    .dropTableIfExists("messageHistory")
    .dropTableIfExists("conversations")
    .dropTableIfExists("patients")
    .dropTableIfExists("coaches")
    .dropTableIfExists("users")
    .dropTableIfExists("patient-login");
};
