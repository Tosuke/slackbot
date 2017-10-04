export default class SlackError extends Error {
  constructor(error: string) {
    super(error)
  }
}
