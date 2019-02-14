const routes = [{
  name: 'notifications.user',
  path: 'notification',
  component: () => import('../components/notification/notification-user')
}]

module.exports = routes;
