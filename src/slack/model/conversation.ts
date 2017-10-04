import Message from './message'

export default interface Conversation {
  is_channel: boolean | undefined
  is_group: boolean | undefined
  is_mpim: boolean | undefined
  is_im: boolean | undefined

  id: string
  name: string
  created: number
  creator: string
  is_archived: boolean

  last_read: string
  latest: Message
  unread_count: number
  unread_count_display: number
}
