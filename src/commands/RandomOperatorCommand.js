import BaseCommand from '../BaseCommand'


class RandomOperatorCommand extends BaseCommand {

  constructor ({ api }) {
    super(...arguments)
    this._api = api
  }

  shouldInvoke () {
    return (this._command === 'randomop' || this._command === 'randomoperator')
  }

  async invoke () {
    if (this._args.length < 1) {
      return this.reply('사용법: randomop <역할 (공격(attacker)혹은 수비(defender))>')
    }

    let { data: operators } = await this._api.call({
      method: 'get',
      url: '/database/operators'
    })

    let role
    switch (this._args[0].toLowerCase()) {
      case 'attacker':
      case 'atk':
        role = 'attacker'
        break
      case 'defender':
      case 'def':
        role = 'defender'
        break
      default:
        return this.reply('Role not recognized. Usage: randomop <role (attacker or defender)>')
    }

    operators = operators.filter(op => op.role === role || op.role === 'recruit')
    const random = operators[(Math.floor(Math.random() * operators.length))]

    const { name, images: { badge: badge_url } } = random

    this.reply({
      embed: {
        color: 3447003,
        title: '랜덤 오퍼레이터',
        fields: [
          {
            name: '선택된 오퍼레이터',
            inline: true,
            value: '**이름**:' + name + '\n'
          }
        ],
        thumbnail: {
          url: badge_url
        },
      }
    })

  }
}

export default RandomOperatorCommand
