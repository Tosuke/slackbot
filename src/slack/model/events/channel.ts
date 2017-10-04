export interface ChannelArchiveEvent {
  type: 'channel_archive'
  channel: string
  user: string
}

export interface ChannelCreatedEvent {
  type: 'channel_created'
  channel: {
    id: string
    name: string
    created: string
    creator: string
  }
}

export interface ChannelDeletedEvent {
  type: 'channel_deleted'
  channel: string
}

export interface ChannelHistoryChangedEvent {
  type: 'channel_history_changed'
  latest: string
  ts: string
  event_ts: string
}

export interface ChannelRenameEvent {
  type: 'channel_rename'
  channel: {
    id: string
    name: string
    created: number
  }
}

export interface ChannelUnarchiveEvent {
  type: 'channel_unarchive'
  channel: string
  user: string
}
