import VarsParser from '../vars/VarsParser'

export default class ShowMessageHandler {

  constructor($root) {
    this.$root = $root
    this.varsParser = new VarsParser()
  }

  doAction(action, page, ctx, data) {
    const msg = action.params.ShowMessage
    const result = this.varsParser.parse(msg.content, {page: page, component: ctx})
    this.$root.$message[msg.method](result, msg.duration)
  }
}
