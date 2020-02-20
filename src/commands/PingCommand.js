import BaseCommand from '../BaseCommand'

class PingCommand extends BaseCommand {
  constructor ({ }) {
    super(...arguments)
  }

  shouldInvoke () {
    return this._command === 'ping'
  }

  invoke () {
    this.reply('퐁!')
  }
}


export default PingCommand
