export type EmojiChangedEvent = EmojiAddedEvent | EmojiRemovedEvent

export interface EmojiAddedEvent {
  type: 'emoji_changed'
  subtype: 'add'
  name: string
  value: string
  event_ts: string
}

export interface EmojiRemovedEvent {
  type: 'emoji_changed'
  subtype: 'remove'
  names: Array<string>
  event_ts: string
}
