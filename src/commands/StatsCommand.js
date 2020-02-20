import BaseCommand from '../BaseCommand'

import { getPlatform, getGamemode, playtime } from '../utilities'

class StatsCommand extends BaseCommand {

  constructor({ api }) {
    super(...arguments)
    this._api = api
  }

  shouldInvoke() {
    return this._command === 'stats'
  }

  async invoke() {
    if (this._args.length < 2) {
      return this.reply('사용법: stats <닉네임> <플랫폼> {queue}')
    }

    this.hydrateParameters()

    try {
      var { data: players } = await this._api.playerSearch({ username: this.username, platform: this.platform.name })
      if (!(players && players.length && players.length >= 1)) return this.reply('플레이어를 찾을수 없어요.')

      var player = players[0]

      var { data: rawStats } = await this._api.playerStats({ uuid: player.ubisoft_id })
      if (!(rawStats)) return this.reply('전적을 찾지 못했어요.')
    } catch (e) {
      return this.reply('전적을 찾지 못했어요.')
    }

    const stats = rawStats.stats[0]
    const progression = rawStats.progression

    if (this.queue === 'general') {
      var { kills, deaths, wins, losses } = stats.general
    } else if (this.queue === 'ranked') {
      var { kills, deaths, wins, losses } = stats.queue.ranked
    } else if (this.queue === 'casual') {
      var { kills, deaths, wins, losses } = stats.queue.casual
    }

    let kd = deaths > 0 ? (kills / deaths).toFixed(2) : '정보 없음'
    let wlr = losses > 0 ? (wins / losses).toFixed(2) : '정보 없음'

    let {
      assists, headshots, revives,
      suicides, barricades_deployed,
      reinforcements_deployed,
      melee_kills, penetration_kills,
      blind_kills, rappel_breaches,
      dbnos, playtime: timePlayed
    } = stats.general

    let {
      level, lootbox_probability
    } = progression

    const statsUrl = 'https://r6stats.com/stats/' + player.ubisoft_id

    const title = this.queue.charAt(0).toUpperCase() + this.queue.slice(1)
    this.reply({
      embed: {
        color: 3447003,
        author: {
          name: player.username,
          url: statsUrl,
          icon_url: this.platform.image
        },
        thumbnail: {
          url: `https://ubisoft-avatars.akamaized.net/${player.ubisoft_id}/default_146_146.png`
        },
        title: title + ' 플레이어 전적',
        description: `[${player.username}의 전체 전적 보기](${statsUrl})`,
        fields: [
          {
            name: '정보',
            inline: true,
            value: '**레벨**: ' + level + '\n'
              + '**플레이타임**: ' + playtime(timePlayed) + '\n'
              + '**알파팩 확률**: ' + (lootbox_probability / 100) + '%'
          },
          {
            name: '킬/데스',
            inline: true,
            value: '**킬**: ' + kills + '\n'
              + '**데스**: ' + deaths + '\n'
              + '**어시스트**: ' + assists + '\n'
              + '**K/D**: ' + kd
          },
          {
            name: '승/패',
            inline: true,
            value: '**승리**: ' + wins + '\n'
              + '**패배**: ' + losses + '\n'
              + '**승률**: ' + wlr
          },
          {
            name: '킬 분석',
            inline: true,
            value: '**헤드샷**: ' + headshots + '\n'
              + '**블라인드 킬**: ' + blind_kills + '\n'
              + '**근접공격 킬**: ' + melee_kills + '\n'
              + '**레펠링 킬**: ' + penetration_kills
          },
          {
            name: '기타.',
            inline: true,
            value: '**팀원 살리기**: ' + revives + '\n'
              + '**자살**: ' + suicides + '\n'
              + '**바리케이드**: ' + barricades_deployed + '\n'
              + '**강화**: ' + reinforcements_deployed + '\n'
              + '**레펠 브리칭**: ' + rappel_breaches + '\n'
              + '**다운시킨 적**: ' + dbnos
          },
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
    let queue = getGamemode(this._args[i + 1] ? this._args[i + 1].toLowerCase() : null)
    if (!platform) {
      return this.reply(`${this._args[i]}플랫폼 이름이 올바르지 않습니다. pc, xbox, or ps4 중 하나를 선택하십시오.`)
    }
    this.platform = platform
    this.queue = queue || 'general'
    this.username = username
  }

}

export default StatsCommand
