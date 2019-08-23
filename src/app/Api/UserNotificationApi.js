import { ResourceApi } from '@quartz/core'

export class UserNotificationApi extends ResourceApi {
  resource_url = '/user/notifications';

  /**
   * Index
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  index (params) {
    return this.get('', { params: params})
  }

  /**
   * Index
   *
   * @param {int} id
   * @param {Object} params
   *
   * @return {Promise}
   */
  show (id, params) {
    return this.get('/' + id, { params: params })
  }

  /**
   * Mark as read
   *
   * @param {int} id
   *
   * @return {Promise}
   */
  markAsRead (id) {
    return this.post('/' + id + '/read')
  }

  /**
   * Mark as read
   *
   * @param {int} id
   *
   * @return {Promise}
   */
  markAsUnread (id) {
    return this.post('/' + id + '/unread')
  }
};
