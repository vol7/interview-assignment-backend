import { isAuthenticated } from 'middleware/validators'
import * as user from './controller'

export const baseUrl = '/users'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [user.create]
  },
  {
    method: 'GET',
    route: '/me',
    handlers: [isAuthenticated, user.getMe]
  },
  {
    method: 'PUT',
    route: '/me',
    handlers: [isAuthenticated, user.update]
  }
]
