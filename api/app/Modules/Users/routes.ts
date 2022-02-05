import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/login', 'Auth.login')
  Route.get('/logout', 'Auth.logout')
  Route.post('/create', 'Users.create')
  Route.get('/me', 'Users.me')
  Route.get('/:id', 'Users.get')
})
  .prefix('/users')
  .namespace('App/Modules/Users/Controllers')
