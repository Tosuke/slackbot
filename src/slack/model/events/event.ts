import {
  ChannelArchiveEvent,
  ChannelCreatedEvent,
  ChannelDeletedEvent,
  ChannelHistoryChangedEvent,
  ChannelRenameEvent,
  ChannelUnarchiveEvent,
} from './channel'
import { CommandsChangedEvent } from './command'
import { DndUpdatedUserEvent } from './dnd'
import { EmojiChangedEvent } from './emoji'
import {
  FileChangeEvent,
  FileCommentAddedEvent,
  FileCommentDeletedEvent,
  FileCreatedEvent,
  FileDeletedEvent,
  FilePublicEvent,
  FileSharedEvent,
  FileUnsharedEvent,
} from './file'
import {
  GroupArchiveEvent,
  GroupHistoryChangedEvent,
  GroupRenameEvent,
  GroupUnarchiveEvent,
} from './group'
import { ImCloseEvent, ImCreatedEvent, ImHistoryChangedEvent } from './im'
import { MemberJoinedChannelEvent, MemberLeftChannelEvent } from './member'
import { MessageEvent } from './message'
import { PresenceChangeEvent } from './presence'
import { ReactionAddedEvent, ReactionRemovedEvent } from './reaction'
import { TeamJoinEvent } from './team'
import { UserChangeEvent } from './user'

export type Event =
  | ChannelArchiveEvent
  | ChannelCreatedEvent
  | ChannelDeletedEvent
  | ChannelHistoryChangedEvent
  | ChannelRenameEvent
  | ChannelUnarchiveEvent
  | CommandsChangedEvent
  | DndUpdatedUserEvent
  | EmojiChangedEvent
  | FileChangeEvent
  | FileCommentAddedEvent
  | FileCommentDeletedEvent
  | FileCreatedEvent
  | FileDeletedEvent
  | FilePublicEvent
  | FileSharedEvent
  | FileUnsharedEvent
  | GroupArchiveEvent
  | GroupHistoryChangedEvent
  | GroupRenameEvent
  | GroupUnarchiveEvent
  | ImCloseEvent
  | ImCreatedEvent
  | ImHistoryChangedEvent
  | MemberJoinedChannelEvent
  | MemberLeftChannelEvent
  | MessageEvent
  | PresenceChangeEvent
  | ReactionAddedEvent
  | ReactionRemovedEvent
  | TeamJoinEvent
  | UserChangeEvent
