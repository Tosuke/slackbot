export interface FileChangeEvent {
  type: 'file_change'
  file_id: string
  file: {
    id: string
  }
}

export interface FileCommentAddedEvent {
  type: 'file_comment_added'
  comment: object
  file_id: string
  file: {
    id: string
  }
}

export interface FileCommentDeletedEvent {
  type: 'file_comment_deleted'
  comment: string
  file_id: string
  file: {
    id: string
  }
}

export interface FileCreatedEvent {
  type: 'file_created'
  file_id: string
  file: {
    id: string
  }
}

export interface FileDeletedEvent {
  type: 'file_deleted'
  file_id: string
  event_ts: string
}

export interface FilePublicEvent {
  type: 'file_public'
  file_id: string
  file: {
    id: string
  }
}

export interface FileSharedEvent {
  type: 'file_shared'
  file_id: string
  file: {
    id: string
  }
}

export interface FileUnsharedEvent {
  type: 'file_unshared'
  file_id: string
  file: {
    id: string
  }
}
