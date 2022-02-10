import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class UsersController {
  public async create({ auth, request, response }: HttpContextContract) {
    const formSchema = schema.create({
      username: schema.string(),
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [
        rules.regex(
          new RegExp(
            '^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$'
          )
        ),
      ]),
      rememberMe: schema.boolean(),
    })

    const form = await request.validate({ schema: formSchema })

    if (await User.findBy('email', form.email)) {
      return response.badRequest('Email already exists')
    }

    const id = await User.generateId()
    try {
      await User.create({
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        email: form.email,
        username: form.username,
        password: form.password,
        id,
      })
    } catch (err) {
      console.error(err)
      return response.internalServerError('Could not create user, please try again.')
    }

    try {
      await auth.use('web').loginViaId(id, form.rememberMe)
    } catch (err) {
      console.error(err)
      return response.internalServerError("Created user, but couldn't login. Please try manually")
    }

    return 'Successfully created user'
  }

  public async me({ auth, response }: HttpContextContract) {
    let user: User
    try {
      user = await auth.use('web').authenticate()
    } catch (err) {
      console.error(err)
      return response.unauthorized('You are not logged in')
    }

    response.json({
      id: user.id,
      username: user.username,
      email: user.email,
    })
  }

  public async get({ request, response }: HttpContextContract) {
    const user = await User.find(request.param('id'))

    if (!user) {
      return response.notFound('User does not exist')
    }

    response.json({
      id: user.id,
      username: user.username,
    })
  }
}
