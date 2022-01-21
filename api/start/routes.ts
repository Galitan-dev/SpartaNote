import Route from '@ioc:Adonis/Core/Route'
import 'App/Modules/Pronote/routes'
import 'App/Modules/Users/routes'

Route.get('/', async () => {
  return { hello: 'world' }
})
