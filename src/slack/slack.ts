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

import { webApiClient, events, usersById, conversationsById } from './slackimpl'
export const slackApiClient = webApiClient
export const slackEvent = events
export const slackUsersList = usersById
export const slackConversationsList = conversationsById
