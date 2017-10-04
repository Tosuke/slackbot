export interface DndUpdatedUserEvent {
  type: 'dnd_updated_user'
  user: string
  dnd_status: {
    dnd_enabled: boolean
    next_dnd_start_ts: number
    next_dnd_end_ts: number
  }
}
