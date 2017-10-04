export interface ImCloseEvent {
  type: 'im_close'
  user: string
  channel: string
}

export interface ImCreatedEvent {
  type: 'im_created'
  user: string
  channel: object
}

export interface ImHistoryChangedEvent {
  type: 'im_history_changed'
  latest: string
  ts: string
  event_ts: string
}
