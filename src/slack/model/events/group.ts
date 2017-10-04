export interface GroupArchiveEvent {
  type: 'group_archive'
  channel: string
}

export interface GroupHistoryChangedEvent {
  type: 'group_history_changed'
  latest: string
  ts: string
  event_ts: string
}

export interface GroupRenameEvent {
  type: 'group_rename'
  channel: {
    id: string
    name: string
    created: number
  }
}

export interface GroupUnarchiveEvent {
  type: 'group_unarchive'
  channel: string
}
