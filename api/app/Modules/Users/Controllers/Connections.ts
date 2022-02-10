import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import UserConnection from 'App/Models/UserConnection'
import { casList } from 'Pronote/index'

export default class ConnectionsController {
  public async create({ auth, request, response }: HttpContextContract) {
    let user: User
    try {
      user = await auth.use('web').authenticate()
    } catch (err) {
      console.error(err)
      return response.unauthorized('You are not logged in')
    }

    const formSchema = schema.create({
      cas: schema.enum(casList),
      url: schema.string({}, [rules.pronoteUrl()]),
      username: schema.string(),
      password: schema.string(),
    })

    const form = await request.validate({ schema: formSchema })

    const id = await User.generateId()
    try {
      await UserConnection.create({
        id,
        userId: user.id,
        cas: form.cas,
        url: form.url,
        username: form.username,
        password: form.password,
      })
    } catch (err) {
      console.error(err)
      return response.internalServerError('Could not create connection, please try again.')
    }

    return 'Successfully created connection'
  }

  public async list({ auth, response }: HttpContextContract) {
    let user: User
    try {
      user = await auth.use('web').authenticate()
    } catch (err) {
      console.error(err)
      return response.unauthorized('You are not logged in')
    }

    let connections: UserConnection[]
    try {
      connections = await UserConnection.query().where('userId', user.id).orderBy('usedAt', 'desc')
    } catch (err) {
      console.error(err)
      return response.internalServerError('Unable to list connections')
    }

    response.json(
      connections.map((con) => ({
        id: con.userId,
        userId: con.userId,
        username: con.username,
        password: con.password
          .split('')
          .map((c, i) => ([0, 1, con.password.length - 1].includes(i) ? c : '*'))
          .join(''),
        url: con.url,
        cas: con.cas,
      }))
    )
  }

  public async get({ request, response, auth }: HttpContextContract) {
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

    response.json({
      id: con.userId,
      userId: con.userId,
      username: con.username,
      password: con.password
        .split('')
        .map((c, i) => ([0, 1, con!.password.length - 1].includes(i) ? c : '*')),
      url: con.url,
      cas: con.cas,
    })
  }
}
