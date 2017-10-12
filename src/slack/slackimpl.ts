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
    axiosClient.post(`/${method}`, params).then(r => r.data)

  function toString(a: any): string {
    if (typeof a === 'string') {
      return a
    } else {
      return JSON.stringify(a)
    }
  }
})()

export function initialize(): Promise<any> {
  return Promise.all([
    initilizeEvent().then(() =>
      console.info('[INFO] Success to connect RTM API')
    ),
    initializeConversation().then(() =>
      console.info('[INFO] Success to pull conversations')
    ),
    initializeUser().then(() => console.info('[INFO] Success to pull users')),
    initializeEmoji().then(() => console.info('[INFO] Success to pull emojis')),
  ])
}

export const events: SlackEventEmitter = new SlackEventEmitter()

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

export const emojisByName: Map<string, string> = new Map()

async function initializeEmoji() {
  function set(name: string, value: string) {
    if (value.startsWith('alias:')) {
      const resolved = /alias:(.*)/.exec(value) || []
      set(name, emojisByName.get(resolved[1]) || '')
    } else {
      emojisByName.set(name, value)
    }
  }

  const emojiResolvers = {
    noto: code =>
      `https://noto-website.storage.googleapis.com/emoji/emoji_u${code.replace(
        '-',
        '_'
      )}.png`,
    twitter: code => `https://twemoji.maxcdn.com/2/72x72/${code}.png`,
    emojione: code =>
      `https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/png/${code}.png`,
  }

  const emojiList = await axios
    .get(
      'https://gist.githubusercontent.com/kjohnson/cf3a03e3baf3ec5762e0442e30c1718a/raw/bcfca250d6c234bcb0b119a44a3080c80666f0ca/slack-emoji-list.json'
    )
    .then(r => r.data)

  const resolver = emojiResolvers[process.env.NODE_EMOJI_TYPE || 'twitter']
  for (const [name, code] of Object.entries(emojiList)) {
    emojisByName.set(name, resolver(code))
  }

  const { emoji: emojis } = await webApiClient('emoji.list')
  for (const [name, value] of Object.entries(emojis)) {
    set(name, value)
  }

  events.on('event', e => {
    if (e.type === 'emoji_changed') {
      if (e.subtype === 'add') {
        set(e.name, e.value)
      } else {
        for (const name of e.names) {
          emojisByName.delete(name)
        }
      }
    }
  })
}
