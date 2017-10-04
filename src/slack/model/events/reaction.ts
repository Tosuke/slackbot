export interface ReactionAddedEvent {
  type: 'reaction_added'
  user: string
  reaction: string
  item_user: string
  item: Item
  event_ts: string
}

export interface ReactionRemovedEvent {
  type: 'reaction_removed'
  user: string
  reaction: string
  item_user: string
  item: Item
  event_ts: string
}

type Item = MessageItem | FileItem | FileCommentItem

interface MessageItem {
  type: 'message'
  channel: string
  ts: string
}

interface FileItem {
  type: 'file'
  file: string
}

interface FileCommentItem {
  type: 'file_comment'
  file_comment: string
  file: string
}
