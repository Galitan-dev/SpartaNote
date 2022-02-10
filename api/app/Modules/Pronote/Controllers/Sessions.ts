import Encryption from '@ioc:Adonis/Core/Encryption'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserConnection from 'App/Models/UserConnection'
import { errors } from 'Pronote/index'
import { URL } from 'url'
import SessionManager from '../SessionManager'

export default class SessionsController {
  private static sessionManager: SessionManager = new SessionManager()

  private get sessionManager(): SessionManager {
    return SessionsController.sessionManager
  }

  public async open({ request, response, auth }: HttpContextContract) {
    let user: User
    try {
      user = await auth.use('web').authenticate()
    } catch (err) {
      console.error(err)
      return response.unauthorized('You are not logged in')
    }

    let con: UserConnection | null
    try {
      con = await UserConnection.find(request.param('id'))
    } catch (err) {
      console.error(err)
      return response.internalServerError('Unable to get connection')
    }

    if (!con || con.userId !== user.id) {
      return response.notFound('Connection not found')
    }

    if (this.sessionManager.get(con.id)) {
      return response.abort('Session already opened')
    }

    try {
      await this.sessionManager.createSession({
        userId: user.id,
        connectionId: con.id,
        url: con.url,
        cas: con.cas,
        username: con.username,
        password: Encryption.decrypt(con.password)!,
      })
    } catch (err) {
      switch (err.code) {
        case errors.CLOSED.code:
          return response.serviceUnavailable('Pronote is currently not available')
        case errors.WRONG_CREDENTIALS.code:
          return response.unauthorized(
            'Wrong credentials. You may have to use a cas, contact the support for more help.'
          )
        case 'ENOTFOUND':
          return response.notFound('Domain not found')
        default:
          return response.internalServerError({
            code: err.code,
            message: err.message,
          })
      }
    }

    return 'Session successfully opened'
  }

  public async get({ request, response, auth }: HttpContextContract) {
    const scope = new URL(request.completeUrl(true)).searchParams.get('scope') || 'user'
    if (
      !scope.match(
        /^(,?(params|user|advancedUser|homeworks|marks|timetable|evaluations|files|absences|menu|infos))*$/g
      )
    ) {
      response.badRequest('scope validation failed, please refer to the documentation')
      return
    }

    let user: User
    try {
      user = await auth.use('web').authenticate()
    } catch (err) {
      console.error(err)
      return response.unauthorized('You are not logged in')
    }

    let con: UserConnection | null
    try {
      con = await UserConnection.find(request.param('id'))
    } catch (err) {
      console.error(err)
      return response.internalServerError('Unable to get connection')
    }

    if (!con || con.userId !== user.id) {
      return response.notFound('Connection not found')
    }

    let session = await this.sessionManager.get(con.id)

    if (!session) {
      return response.abort('Session not yet opened')
    }

    let { pronote } = session

    const scopedUser = scope.includes('advancedUser')
      ? pronote.user
      : scope.includes('user')
      ? {
          id: pronote.user?.id,
          name: pronote.user?.name,
          establishment: pronote.user?.establishment,
          avatar: pronote.user?.avatar,
          class: pronote.user?.studentClass,
        }
      : undefined

    const scopedSession = {
      id: session.connectionId,
      user: scopedUser,
    }

    for (const key of scope
      .split(',')
      .filter((s) => s.length > 1 && !s.toLowerCase().includes('user'))) {
      if (typeof pronote[key] === 'function') {
        scopedSession[key] = await pronote[key]()
      } else {
        scopedSession[key] = pronote[key]
      }
    }

    return scopedSession
  }

  public async close({ request, response, auth }: HttpContextContract) {
    let user: User
    try {
      user = await auth.use('web').authenticate()
    } catch (err) {
      console.error(err)
      return response.unauthorized('You are not logged in')
    }

    let con: UserConnection | null
    try {
      con = await UserConnection.find(request.param('id'))
    } catch (err) {
      console.error(err)
      return response.internalServerError('Unable to get connection')
    }

    if (!con || con.userId !== user.id) {
      return response.notFound('Connection not found')
    }

    let session = await this.sessionManager.get(con.id)

    if (!session) {
      return response.abort('Session not yet opened')
    }

    try {
      this.sessionManager.close(con.id)
    } catch (err) {
      console.error(err)
      return response.internalServerError('Unable to close session')
    }

    return 'Session successfully closed'
  }

  public async list({ response, auth }: HttpContextContract) {
    let user: User
    try {
      user = await auth.use('web').authenticate()
    } catch (err) {
      console.error(err)
      return response.unauthorized('You are not logged in')
    }

    return this.sessionManager.list(user.id).map(({ connectionId, pronote }) => ({
      id: connectionId,
      user: {
        id: pronote.user?.id,
        name: pronote.user?.name,
        establishment: pronote.user?.establishment,
        avatar: pronote.user?.avatar,
        class: pronote.user?.studentClass,
      },
    }))
  }
}
