import BaseCommand from '../BaseCommand'

import { getPlatform, playtime } from '../utilities'

class OperatorStatsCommand extends BaseCommand {

  constructor({ api }) {
    super(...arguments)
    this._api = api
  }

  shouldInvoke() {
    return this._command === 'operator'
  }

  async invoke() {
    if (this._args.length < 3) {
      return this.reply('사용법: operator <닉네임> <플랫폼> <오퍼레이터>')
    }

    this.hydrateParameters()

    const { data: players } = await this._api.playerSearch({ username: this.username, platform: this.platform.name })
    if (!(players && players.length && players.length >= 1)) return this.reply('No players found.')

    const player = players[0]

    const { data: { operators } } = await this._api.playerStats({ uuid: player.ubisoft_id })
    if (!(operators)) return this.reply('전적을 찾을수가 없어요.')

    const operator = operators.find(op => op.operator.internal_name === this.operator.toLowerCase())

    if (!operator) return this.reply('오퍼레이터를 찾을수가 없어요.')

    let { operator: { name, role, ctu, images: { badge } }, abilities, kills, deaths, kd, wins, losses, wl, playtime: timePlayed } = operator
    role = (role === 'defender' ? 'Defender' : 'Attacker')
    timePlayed = playtime(timePlayed)

    let specialLine = ''
    for (let ability of abilities) {
      specialLine += '**' + ability.title + '**: ' + ability.value + '\n'
    }

    this.reply({
      embed: {
        color: 3447003,
        author: {
          name: player.username + '의 오퍼레이터 전적',
          url: 'https://r6stats.com/stats/' + player.ubisoft_id,
          icon_url: this.platform.image
        },
        thumbnail: {
          url: badge
        },
        fields: [
          {
            name: '정보',
            inline: true,
            value: '**오퍼레이터**: ' + name + '\n'
              + '**역할**: ' + role + '\n'
              + '**부대**: ' + ctu + '\n'
              + '**플레이타임** ' + timePlayed + '\n'
          },
          {
            name: '킬/데스',
            inline: true,
            value: '**킬**: ' + kills + '\n'
              + '**데스**: ' + deaths + '\n'
              + '**K/D**: ' + kd + '\n'
          },
          {
            name: '승/패',
            inline: true,
            value: '**승리**: ' + wins + '\n'
              + '**패배**: ' + losses + '\n'
              + '**승률**: ' + wl + '\n'
          },
          {
            name: '특별',
            inline: true,
            value: specialLine
          }
        ],
        footer: {
          icon_url: 'https://r6stats.com/img/logos/r6stats-100.png',
          text: 'R6Stats.com 에서 스탯 제공됨',
          url: 'https://r6stats.com'
        }
      }
    })
  }

  hydrateParameters() {
    let username = this._args[0]
    var i = 1
    if (username.startsWith('"') || username.startsWith('“') || username.startsWith('”')) {
      while (!(username.endsWith('"') || username.endsWith('“') || username.endsWith('”')) && i < this._args.length - 1) {
        username += ' ' + this._args[i]
        i++
      }
      username = username.replace(/"/g, '').replace(/“/g, '').replace(/”/g, '')
    }
    let platform = getPlatform(this._args[i].toLowerCase())
    let operator = this._args[i + 1]
    if (!platform) {
      return this.reply(`${this._args[i]}플랫폼 이름이 올바르지 않습니다. pc, xbox, or ps4 중 하나를 선택하십시오.`)
    }
    this.platform = platform
    this.operator = operator
    this.username = username
  }

}

export default OperatorStatsCommand
