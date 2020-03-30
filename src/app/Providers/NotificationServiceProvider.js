import { ServiceProvider } from '@quartz/core'
import { container } from '@quartz/core'

export class NotificationServiceProvider extends ServiceProvider {
  register() {

    this.addRoutes('app', require('./../../routes/notification.js'))

    this.addLang({
      'en': require('../../../lang/notification/en.json'),
      'it': require('../../../lang/notification/it.json')
    })
  }

  boot() {


  }
}
