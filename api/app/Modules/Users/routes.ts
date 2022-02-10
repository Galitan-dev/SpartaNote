import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'Auth.login')
    Route.get('/ogout', 'Auth.logout')
  }).prefix('/auth')

  Route.group(() => {
    Route.post('/create', 'Users.create')
    Route.get('/me', 'Users.me')
    Route.get('/:id', 'Users.get')
  }).prefix('/users')

  Route.group(() => {
    Route.get('/:id', 'Connections.get')
    Route.post('/create', 'Connections.create')
    Route.get('/', 'Connections.list')
  }).prefix('/connections')
}).namespace('App/Modules/Users/Controllers')
