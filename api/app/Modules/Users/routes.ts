import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/login', 'Auth.login')
  Route.post('/logout', 'Auth.logout')
  Route.post('/create', 'Users.create')
  Route.post('/me', 'Users.me')
  Route.post('/:id', 'Users.get')
})
  .prefix('/users')
  .namespace('App/Modules/Users/Controllers')
