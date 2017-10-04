import User from '../user'

export interface TeamJoinEvent {
  type: 'team_join'
  user: User
}
