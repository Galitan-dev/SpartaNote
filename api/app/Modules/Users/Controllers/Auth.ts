import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const credentialsSchema = schema.create({
      email: schema.string(),
      password: schema.string(),
      rememberMe: schema.boolean(),
    })

    const credentials = await request.validate({ schema: credentialsSchema })

    try {
      await auth.use('web').attempt(credentials.email, credentials.password, credentials.rememberMe)
    } catch (err) {
      console.error(err)
      response.unauthorized('Invalid credentials')
    }

    return 'Successfully logged in'
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('web').logout()
    return 'Successfully logged out'
  }
}
