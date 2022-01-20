import { login, PronoteStudentSession } from 'Pronote/index'

export default class SessionManager {
  private sessions: PronoteStudentSession[] = []

  public async createSession({
    cas,
    url,
    username,
    password,
  }: SessionConfig): Promise<PronoteStudentSession> {
    const session = await login(url, username, password, cas)
    this.sessions.push(session)
    return session
  }

  public async getSession(id: number): Promise<PronoteStudentSession> {
    const session = this.sessions.find((s) => s.id === id)
    if (!session) {
      const error = new Error(`Session ${id} not found`)
      error.name = 'notFound'
      throw error
    }

    return session
  }
}

export interface SessionConfig {
  cas: string
  url: string
  username: string
  password: string
}
