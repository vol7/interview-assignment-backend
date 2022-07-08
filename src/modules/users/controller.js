import User from 'models/user'

export async function create(ctx) {
  try {
    const user = await User.query()
      .insert(ctx.request.body)
      .returning('*')
    const token = user.generateToken()
    ctx.body = { token, user }
  } catch (err) {
    switch (err.code) {
      case '23505':
        ctx.throw(409, 'emailAlreadyExists')
        break
      default:
        ctx.throw(422, err.message || 'defaultError')
    }
  }
}

export async function getMe(ctx, next) {
  const { user } = ctx
  ctx.body = { user }
}

export async function update(ctx) {
  const { user } = ctx
  const update = ctx.request.body
  const errors = {}

  // Require passing the old password to allow changing to a new one
  if (update.password) {
    const passwordValidated = await user.validatePassword(update.oldPassword)
    if (!passwordValidated) {
      errors.oldPassword = 'incorrectPassword'
      errors._error = 'userUpdateFailure'
      ctx.throw(409, JSON.stringify(errors))
    }
  }

  try {
    const response = await user
      .$query()
      .patch(update)
      .returning('*')
      .first()
    ctx.body = { user: response }
  } catch (err) {
    errors._error = 'userUpdateFailure'
    switch (err.code) {
      case '23505':
        errors.email = 'already exists'
    }
    ctx.throw(409, JSON.stringify(errors))
  }
}
