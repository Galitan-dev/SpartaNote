import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/sessions/:id', 'Sessions.get')
  Route.get('/sessions/:id/close', 'Sessions.close')
  Route.post('/sessions/:id/open', 'Sessions.open')
  Route.get('/sessions/', 'Sessions.list')
})
  .prefix('/pronote')
  .namespace('App/Modules/Pronote/Controllers')
