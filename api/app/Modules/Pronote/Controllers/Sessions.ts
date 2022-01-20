import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { casList, errors } from 'Pronote/index'
import SessionManager from '../SessionManager'
import { URL } from 'url'

export default class SessionsController {
  private static sessionManager: SessionManager = new SessionManager()

  private get sessionManager(): SessionManager {
    return SessionsController.sessionManager
  }

  public async create({ request, response }: HttpContextContract) {
    const optionsSchema = schema.create({
      cas: schema.enum(casList),
      url: schema.string({}, [rules.pronoteUrl()]),
      username: schema.string(),
      password: schema.string(),
    })

    const options = await request.validate({ schema: optionsSchema })

    try {
      const session = await this.sessionManager.createSession(options)
      return { code: 200, sessionId: session.id }
    } catch (err) {
      if (err.code === errors.CLOSED.code) {
        response.serviceUnavailable({
          code: 503,
          message: 'Pronote is currently not available',
        })
      } else if (err.code === errors.WRONG_CREDENTIALS.code) {
        response.unauthorized({
          code: 401,
          message:
            'Wrong credentials. You may have to use a cas, contact the support for more help.',
        })
      } else if (err.code === 'ENOTFOUND') {
        response.notFound({
          code: 404,
          message: 'Domain not found: ' + err.message.split(' ').at(-1),
        })
      } else {
        response.internalServerError({
          code: err.code,
          message: err.message,
        })
      }
    }
  }

  public async get({ request, response }: HttpContextContract) {
    const id = request.param('id')
    if (!id || isNaN(id)) {
      response.badRequest({
        code: 400,
        message: 'id verification failed',
      })
      return
    }

    const scope = new URL(request.completeUrl(true)).searchParams.get('scope') || 'user'
    if (
      !scope.match(
        /^(,?(params|user|advancedUser|homeworks|marks|timetable|evaluations|files|absences|menu|infos))*$/g
      )
    ) {
      response.badRequest({
        code: 400,
        message: 'scope validation failed, please refer to the documentation',
      })
      return
    }

    try {
      const session = await this.sessionManager.getSession(parseInt(id))

      const scopedUser = scope.includes('advancedUser')
        ? session.user
        : scope.includes('user')
        ? {
            id: session.user?.id,
            name: session.user?.name,
            establishment: session.user?.establishment,
            avatar: session.user?.avatar,
            class: session.user?.studentClass,
          }
        : undefined

      const scopedSession = {
        id: session.id,
        user: scopedUser,
      }

      for (const key of scope
        .split(',')
        .filter((s) => s.length > 1 && !s.toLowerCase().includes('user'))) {
        if (typeof session[key] === 'function') {
          scopedSession[key] = await session[key]()
        } else {
          scopedSession[key] = session[key]
        }
      }

      return { code: 200, session: scopedSession }
    } catch (err) {
      if (err.name === 'notFound') {
        response.notFound({
          code: 404,
          message: err.message,
        })
      } else {
        response.internalServerError({
          code: 500,
          message: err.message,
        })
      }
    }
  }
}
