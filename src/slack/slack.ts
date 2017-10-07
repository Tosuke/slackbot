export type SlackWebApiClient = (
  method: string,
  params?: object
) => Promise<any>

import TypedEventEmitter from '../utils/typed_event_emitter'
import { Event } from './model/events/event'
import { MessageEvent } from './model/events/message'
interface Events {
  event: Event
  message: MessageEvent
}
export class SlackEventEmitter extends TypedEventEmitter<Events> {}

import * as impl from './slackimpl'
export const initialize = impl.initialize
export const slackApiClient = impl.webApiClient
export const slackEvent = impl.events
export const slackUsersList = impl.usersById
export const slackConversationsList = impl.conversationsById
