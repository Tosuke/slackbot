export type MessageEvent =
  | MessageCreatedEvent
  | MessageChangedEvent
  | MessageDeletedEvent
  | MessageRepliedEvent

export interface MessageCreatedEvent {
  type: 'message'
  subtype: undefined
  channel: string
  user: string
  text: string
  ts: string
}

export interface MessageChangedEvent {
  type: 'message'
  subtype: 'message_changed'
  hidden: true
  channel: string
  ts: string
  message: MessageCreatedEvent & {
    edited: {
      user: string
      ts: string
    }
  }
}

export interface MessageDeletedEvent {
  type: 'message'
  subtype: 'message_deleted'
  hidden: boolean
  channel: string
  ts: string
  deleted_ts: string
}

export interface MessageRepliedEvent {
  type: 'message'
  subtype: 'message_replied'
  message: {
    type: 'message'
    user: string
    text: string
    thread_ts: string
    reply_count: number
    replies: [
      {
        user: string
        ts: string
      }
    ]
    ts: string
  }
  hidden: boolean
  channel: string
  event_ts: string
  ts: string
}
