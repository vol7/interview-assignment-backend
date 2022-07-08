exports.up = knex =>
  knex.schema.hasTable('users').then(exists => {
    if (exists) return
    return knex.schema.createTable('users', t => {
      t.increments('id').primary()

      t.string('email').unique().notNullable()
      t.string('password').notNullable()
      t.string('first_name').notNullable()
      t.string('last_name').notNullable()
      t.timestamp('last_seen').defaultTo(knex.fn.now())

      t.timestamps()
    })
  })

exports.down = knex => knex.schema.dropTableIfExists('users')
