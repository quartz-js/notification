import { ServiceProvider } from '@quartz/core'
import { container } from '@quartz/core'
import Vue from 'vue'

export class NotificationServiceProvider extends ServiceProvider {
  register() {

    this.addRoutes(null, require('./../../routes/notification.js'))

    this.addLang({
      'en': require('../../../lang/notification/en.json'),
      'it': require('../../../lang/notification/it.json')
    })
  }

  boot() {


  }
}
