<template>
  <div>
    <v-menu :nudge-width="400" nudge-top="-51" nudge-left='50' v-if="notifications">
      <v-btn flat icon v-if="notifications.meta.pagination.total" slot="activator" ><v-badge color="red" overlap>
        <span slot="badge">{{ notifications.meta.pagination.total }}</span>
        <v-icon class="outlined">far fa-bell</v-icon>
      </v-badge></v-btn>

      <v-btn icon v-if="!notifications.meta.pagination.total" slot="activator">
         <v-icon>far fa-bell</v-icon>
      </v-btn>

        <v-subheader  class="headline primary" dark primary-title>
          {{ $t('$quartz.notification.title') }}
        </v-subheader>
      <v-list>
        <v-list-tile v-for="(notification, index) in notifications.data" :key="index"  v-if="notification.data.message" @click="onClickNotification(notification)">
          <v-list-tile-action>
            <v-icon color="primary" v-if="getNotificationType(notification) === 'file'">attach_file</v-icon>
            <v-icon color="error" v-if="getNotificationType(notification) === 'error'">warning</v-icon>
            <v-icon color="primary" v-if="getNotificationType(notification) === 'info'">lens</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ notification.data.message }}

              <span v-if="getNotificationType(notification) === 'error'">:
                <small class='text-danger'>
                  {{ notification.data. options.error.message }}
                </small>
              </span>
            </v-list-tile-title>

            <v-list-tile-sub-title >{{ moment(notification.created_at).fromNow() }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'notifications.user' }">
          <v-list-tile-content>
            <v-list-tile-title>
              {{ $t('$quartz.notification.show_all') }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { UserNotificationApi } from '../../app/Api/UserNotificationApi'
import moment from 'moment'
import { container, mixins } from '@quartz/core'

export default {
  props: ['user'],
  mixins: [
    mixins.utils
  ],
  data () {
    return {
      notifications: null
    }
  },
  created () {
    if (container.get('config').app.websocket.url) {
      window.Echo.private('user.' + this.user.id).listen('NotificationEvent', (e) => {
        this.load()

        let key = `notification.${e.id}`;

        if (localStorage.getItem(key)) {
          return;
        }
        
        localStorage.setItem(key, 1);

        setTimeout(function () {
          localStorage.removeItem(key);
        }, 10);

        window.Notify.prompt(e.title, {
          'body': e.message,
          'icon': require('@/assets/logo.png')
        }, () => {
        }, 200)
      })
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    markAsRead (notification) {
      var api = new UserNotificationApi()
      api.markAsRead(notification.id).then(response => {
        return this.load()
      }).catch(response => {

      })
    },

    getNotificationType (notification) {
      if (notification.data.options && notification.data.options.url) {
        return 'file'
      }

      if (notification.data.options && notification.data.options.error) {
        return 'error'
      }

      return 'info'
    },

    getIconNotification (notification) {
      var type = this.getNotificationType(notification)

      if (type === 'file') {
        return 'fa fa-download text-info'
      }

      if (type === 'error') {
        return 'fas fa-exclamation-triangle text-danger'
      }

      return 'fa fa-info text-info'
    },

    onClickNotification (notification) {
      var type = this.getNotificationType(notification)

      if (type === 'file') {
        window.open(notification.data.options.url, '_blank')
      }

      this.markAsRead(notification)
    },
    load () {
      var api = new UserNotificationApi()
      api.index({ show: 10, query: 'read_at is null', sort_field: 'created_at', sort_direction: 'DESC' }).then(response => {
        this.notifications = response.body
      })
    }
  }
}
</script>

<style>

  .notification-counter {
      position: absolute;
      top: -5px;
      right: -2px;
      background: #dc3545;
      border-radius: 100px;
      font-size: 10px;
      width: 19px;
      height: 19px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
  }

  .notification-icon {
    font-size: 22px;
    margin: 0 4px;
  }

  .notification-icon:hover {

  }

  .notification-window {
      width: 500px;
  }

  .notification-content {
      border-bottom: 1px solid #efefef;
  }

  .notification-message {
      margin-left: 10px;
  }

  .notification-marker {
      opacity: 0.4;
  }

  .notification-marker:hover {
      opacity: 0.9;
  }
</style>
