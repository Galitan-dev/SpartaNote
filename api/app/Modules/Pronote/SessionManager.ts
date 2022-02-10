import { login, PronoteStudentSession } from 'Pronote/index'

export default class SessionManager {
  private sessions: Session[] = []

  public async createSession({
    userId,
    connectionId,
    cas,
    url,
    username,
    password,
  }: SessionConfig): Promise<Session> {
    const session = {
      userId,
      connectionId,
      pronote: await login(url, username, password, cas),
    }

    this.sessions.push(session)
    return session
  }

  public getSession(connectionId: number): Session | undefined {
    return this.sessions.find((s) => s.connectionId === connectionId)
  }
}

export interface Session {
  connectionId: number
  userId: number
  pronote: PronoteStudentSession
}

export interface SessionConfig {
  connectionId: number
  userId: number
  cas: string
  url: string
  username: string
  password: string
}
