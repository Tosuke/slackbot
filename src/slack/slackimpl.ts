import axios from 'axios'
import * as WebSocket from 'ws'
import SlackError from './error'
import { SlackWebApiClient, SlackEventEmitter } from './slack'

export const webApiClient: SlackWebApiClient = (() => {
  const axiosClient = axios.create({
    baseURL: 'https://slack.com/api',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    transformRequest: [
      data =>
        Object.entries({ ...data, token: process.env.NODE_SLACKAPI_TOKEN })
          .map(([k, v]) => [k, toString(v)])
          .map(([k, v]) => `${k}=${v}`)
          .join('&'),
    ],
  })

  axiosClient.interceptors.response.use(res => {
    if (res.data.ok) {
      delete res.data.ok
      return res
    } else {
      throw new SlackError(res.data.error)
    }
  })

  return (method: string, params?: object) =>
    axiosClient
      .post(`/${method}`, params)
      .then(r => r.data)
      .catch(err => Promise.reject(err.description || ''))

  function toString(a: any): string {
    if (typeof a === 'string') {
      return a
    } else {
      return JSON.stringify(a)
    }
  }
})()

export const events: SlackEventEmitter = new SlackEventEmitter()
initilizeEvent()
  .then(() => console.info('[INFO]Succeeded to connect to RTM API'))
  .catch(err => console.error(err))

import { Event } from './model/events/event'
async function initilizeEvent() {
  const { url } = await webApiClient('rtm.start')
  const socket = new WebSocket(url)
  await new Promise((res, rej) => {
    socket.once('message', data => {
      const mes = JSON.parse(data.toString())
      if (mes.type === 'hello') {
        socket.removeAllListeners()
        res()
      }
    })

    socket.once('error', err => {
      socket.removeAllListeners()
      rej(err)
    })
  })

  socket.on('message', data => {
    const mes = JSON.parse(data.toString()) as Event
    if (mes.type === undefined) return

    const type: string = mes.type
    if (type === 'reconnect_url') return
    events.emit('event', mes)

    if (mes.type === 'message') {
      if (
        mes.subtype === undefined ||
        mes.subtype === 'message_changed' ||
        mes.subtype === 'message_deleted' ||
        mes.subtype === 'message_replied'
      ) {
        events.emit('message', mes)
        return
      }
    }
  })
}

import User from './model/user'
export const usersById: Map<string, User> = new Map()
initializeUser()
  .then(() => console.info('[INFO]Succeeded to pull users'))
  .catch(err => console.error(err))

async function initializeUser() {
  const { members } = await webApiClient('users.list')
  for (const member of members) {
    usersById.set(member.id, member)
  }

  events.on('event', e => {
    if (e.type === 'user_change') {
      usersById.set(e.user.id, e.user)
      return
    }
    if (e.type === 'team_join') {
      usersById.set(e.user.id, e.user)
      return
    }
  })
}

import Conversation from './model/conversation'
export const conversationsById: Map<string, Conversation> = new Map()
initializeConversation()
  .then(() => console.info('[INFO]Succeeded to pull conversations'))
  .catch(err => console.error(err))

async function initializeConversation() {
  const { channels } = await webApiClient('conversations.list')
  for (const conversation of channels) {
    conversationsById.set(conversation.id, conversation)
  }

  events.on('event', e => {
    if (e.type === 'channel_created' || e.type === 'channel_rename') {
      webApiClient('conversations.info', {
        channel: e.channel.id,
      }).then(({ channel }) => conversationsById.set(channel.id, channel))
    }
    if (e.type === 'channel_deleted') {
      conversationsById.delete(e.channel)
    }
  })
}
