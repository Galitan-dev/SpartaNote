import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/createSession', 'Sessions.create')
  Route.get('/sessions/:id', 'Sessions.get')
})
  .prefix('/pronote')
  .namespace('App/Modules/Pronote/Controllers')
