import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/auth/login', 'Auth.login')
  Route.get('/auth/logout', 'Auth.logout')
  Route.post('/users/create', 'Users.create')
  Route.get('/users/me', 'Users.me')
  Route.get('/users/:id', 'Users.get')
}).namespace('App/Modules/Users/Controllers')
