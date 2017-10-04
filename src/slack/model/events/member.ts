export interface MemberJoinedChannelEvent {
  type: 'member_joined_channel'
  user: string
  channel: string
  channel_type: string
  inviter: string
}

export interface MemberLeftChannelEvent {
  type: 'member_left_channel'
  user: string
  channel: string
  channel_type: string
}
