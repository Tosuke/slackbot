export default interface Message {
  channel: string
  user: string
  text: string
  attachments: Array<object> | undefined
  ts: string
}
