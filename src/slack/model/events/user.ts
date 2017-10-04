import User from '../user'

export interface UserChangeEvent {
  type: 'user_change'
  user: User
}
