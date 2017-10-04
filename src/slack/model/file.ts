import Reaction from './reaction'

export default interface File {
  id: string
  created: number //ts
  timestamp: number //ts
  name: string
  title: string
  mimetype: string
  filetype: string
  pretty_type: string
  user: string
  mode: string
  editable: boolean
  is_external: boolean
  external_type: string
  username: string
  size: number
  url_private: string
  url_private_download: string
  thumb_64: string
  thumb_80: string
  thumb_360: string
  thumb_360_gif: string
  thumb_360_w: number
  thumb_360_h: number
  thumb_480: string
  thumb_480_w: number
  thumb_480_h: number
  thumb_160: string
  permalink: string
  permalink_public: string
  edit_link: string
  preview: string
  preview_highlight: string
  lines: number
  lines_more: number
  is_public: boolean
  public_url_shared: string
  display_as_bot: boolean
  channels: Array<string>
  groups: Array<string>
  ims: Array<string>
  initial_comment: object
  num_stars: 7
  is_starred: boolean
  pinnend_to: Array<string>
  reactions: Array<Reaction>
  comments_count: 1
}
