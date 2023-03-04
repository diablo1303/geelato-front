import VarsParser from '../vars/VarsParser'

export default class ShowNotificationHandler {

  constructor($root) {
    this.$root = $root
    this.varsParser = new VarsParser()
  }

  doAction(action, page, ctx, data) {
    const msg = action.params.ShowNotification
    const result = this.varsParser.parse(msg.content, {page: page, component: ctx})
    this.$root.$notification.open({
      message: result,
      description: msg.description
    })
  }
}
