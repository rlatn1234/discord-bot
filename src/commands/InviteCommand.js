import BaseCommand from '../BaseCommand'

class InviteCommand extends BaseCommand {
  constructor ({ }) {
    super(...arguments)
  }

  shouldInvoke () {
    return this._command === 'invite'
  }

  invoke () {
    this.reply({
      embed: {
        color: 3447003,
        title: 'NOBLE R6S STATS BOT 초대',
        description: '[여기]를 눌러 **NOBLE R6S STATS BOT**을 초대하세요!(https://discordapp.com/oauth2/authorize?client_id=444510041429770240&permissions=0&scope=bot).',
        thumbnail: {
          url: 'https://i.imgur.com/gIX3Iih.png',
        },
        footer: {
          icon_url: 'https://r6stats.com/img/logos/r6stats-100.png',
          text: 'R6Stats.com 에서 스탯 제공됨',
          url: 'https://r6stats.com'
        }
      }
    })
  }
}


export default InviteCommand
