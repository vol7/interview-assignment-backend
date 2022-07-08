import Model from './abstract/base'

import Promise from 'bluebird'
import jwt from 'jsonwebtoken'
import config from 'config'

const bcrypt = Promise.promisifyAll(require('bcrypt'))

export default class User extends Model {
  static tableName = 'users'

  get secureFields() {
    return ['password']
  }

  static relationMappings = {}

  $beforeInsert() {
    super.$beforeInsert()

    if (this.password) {
      return this.hashPassword()
    }
  }

  $beforeUpdate(opts, context) {
    super.$beforeUpdate(opts, context)
    if (this.password && opts.old.password !== this.password) {
      return this.hashPassword()
    }
  }

  generateToken() {
    const { id } = this
    return jwt.sign({ id }, config.jwtSecret)
  }

  validatePassword(password) {
    return bcrypt.compareAsync(password, this.password)
  }

  async hashPassword() {
    const password = this.password

    const salt = await bcrypt.genSaltAsync(10)
    this.password = await bcrypt.hashAsync(password, salt)
  }
}
