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

  public get(connectionId: number): Session | undefined {
    return this.sessions.find((s) => s.connectionId === connectionId)
  }

  public list(userId: number): Session[] {
    return this.sessions.filter((s) => s.userId === userId)
  }

  public async close(connectionId: number) {
    const [session] = this.sessions.splice(
      this.sessions.findIndex((s) => s.connectionId === connectionId),
      1
    )

    await session.pronote.logout()
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
