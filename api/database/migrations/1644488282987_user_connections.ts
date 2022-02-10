import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserConnections extends BaseSchema {
  protected tableName = 'user_connections'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable()
      table.string('username', 255).notNullable()
      table.string('password', 255).notNullable()
      table.string('cas', 180).notNullable()
      table.string('url').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('used_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
