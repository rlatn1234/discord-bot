import BaseCommand from '../BaseCommand'

import { getPlatform } from '../utilities'

const RANKS = [
  { name: 'Unranked', img: 'unranked.svg' },
  { name: 'Copper IV', img: 'copper-4.svg' },
  { name: 'Copper III', img: 'copper-3.svg' },
  { name: 'Copper II', img: 'copper-2.svg' },
  { name: 'Copper I', img: 'copper-1.svg' },
  { name: 'Bronze IV', img: 'bronze-4.svg' },
  { name: 'Bronze III', img: 'bronze-3.svg' },
  { name: 'Bronze II', img: 'bronze-2.svg' },
  { name: 'Bronze I', img: 'bronze-1.svg' },
  { name: 'Silver IV', img: 'silver-4.svg' },
  { name: 'Silver III', img: 'silver-3.svg' },
  { name: 'Silver II', img: 'silver-2.svg' },
  { name: 'Silver I', img: 'silver-1.svg' },
  { name: 'Gold IV', img: 'gold-4.svg' },
  { name: 'Gold III', img: 'gold-3.svg' },
  { name: 'Gold II', img: 'gold-2.svg' },
  { name: 'Gold I', img: 'gold-1.svg' },
  { name: 'Platinum III', img: 'platinum-3-old.svg' },
  { name: 'Platinum II', img: 'platinum-2-old.svg' },
  { name: 'Platinum I', img: 'platinum-1-old.svg' },
  { name: 'Diamond', img: 'diamond-old.svg' }
]

const RANKS_EMBER_RISE = [
  { name: 'Unranked', img: 'unranked.svg' },
  { name: 'Copper V', img: 'copper-5.svg' },
  { name: 'Copper IV', img: 'copper-4.svg' },
  { name: 'Copper III', img: 'copper-3.svg' },
  { name: 'Copper II', img: 'copper-2.svg' },
  { name: 'Copper I', img: 'copper-1.svg' },
  { name: 'Bronze V', img: 'bronze-5.svg' },
  { name: 'Bronze IV', img: 'bronze-4.svg' },
  { name: 'Bronze III', img: 'bronze-3.svg' },
  { name: 'Bronze II', img: 'bronze-2.svg' },
  { name: 'Bronze I', img: 'bronze-1.svg' },
  { name: 'Silver V', img: 'silver-5.svg' },
  { name: 'Silver IV', img: 'silver-4.svg' },
  { name: 'Silver III', img: 'silver-3.svg' },
  { name: 'Silver II', img: 'silver-2.svg' },
  { name: 'Silver I', img: 'silver-1.svg' },
  { name: 'Gold III', img: 'gold-3.svg' },
  { name: 'Gold II', img: 'gold-2.svg' },
  { name: 'Gold I', img: 'gold-1.svg' },
  { name: 'Platinum III', img: 'platinum-3.svg' },
  { name: 'Platinum II', img: 'platinum-2.svg' },
  { name: 'Platinum I', img: 'platinum-1.svg' },
  { name: 'Diamond', img: 'diamond.svg' },
  { name: 'Champions', img: 'champions.svg' },
]

class RankCommand extends BaseCommand {

  constructor({ api }) {
    super(...arguments)
    this._api = api
  }

  shouldInvoke() {
    return (
      this._command === 'rank' ||
      this._command === 'season' ||
      this._command === 'seasonal'
    )
  }

  async invoke() {
    if (this._args.length < 2) {
      return this.reply('사용법: rank <이름> <플랫폼> {지역} {시즌}')
    }

    this.hydrateParamaters()

    try {
      var { data: players } = await this._api.playerSearch({ username: this.username, platform: this.platform.name })
      if (!(players && players.length && players.length >= 1)) return this.reply('플레이어를 찾지 못했어요.')

      var player = players[0]

      var { data: rawStats } = await this._api.seasonalStats({ uuid: player.ubisoft_id })
      if (!(rawStats)) return this.reply('전적을 찾지 못했어요.')
    } catch (e) {
      return this.reply('전적을 찾지 못했어요.')
    }

    const seasons = Object.values(rawStats.seasons).sort((a, b) => (b.id - a.id))
    let season, region
    var self = this
    if (!this.season) {
      season = seasons[0]
    } else {
      season = seasons.find(season => self.season === season.id)
    }

    if (!season) {
      return this.reply('시즌을 찾지 못했어요.')//.then(m => m.delete(3000))
    }

    if (this.region) {
      region = season.regions[this.region][0]
    } else {
      region = Object.values(season.regions).map(r => r[0]).sort((a, b) => (b.max_rank - a.max_rank))[0]
    }

    const REGION_CONVERTS = { ncsa: 'America', na: 'America', emea: 'Europe', eu: 'Europe', apac: 'Asia', asia: 'Asia' }

    let { region: regionKey, wins, losses, abandons, max_mmr, mmr, prev_rank_mmr, next_rank_mmr, skill_mean, skill_standard_deviation, rank, max_rank, champions_rank_position, season_id } = region

    const title = `오퍼레이션 ${season.name}의 ${player.username}님의 ${REGION_CONVERTS[regionKey]}에서의 전적`
    const statsUrl = `https://r6stats.com/stats/${player.ubisoft_id}/seasons`

    this.reply({
      embed: {
        color: 3447003,
        author: {
          name: player.username,
          url: statsUrl,
          icon_url: this.platform.image
        },
        thumbnail: {
          url: this.rankIconThumbnail(season_id, rank, champions_rank_position),
        },
        title,
        description: `[${player.username}의 스탯 보러가기](${statsUrl})`,
        fields: [
          {
            name: '랭크',
            inline: true,
            value: '**현재 MMR**: ' + mmr + '\n'
              + '**현재 랭크**: ' + this.currentRankName(season_id, rank, champions_rank_position) + '\n'
              + '**최대 MMR**: ' + Number(max_mmr).toFixed(2) + '\n'
              + '**최대 랭크**: ' + this.currentRankName(season_id, max_rank, champions_rank_position) + '\n'
              + '**스킬**: ' + Number(skill_mean).toFixed(2) + '±' + Number(skill_standard_deviation).toFixed(2),
          },
          {
            name: '진행도',
            inline: true,
            value: '**이전 랭크**: ' + prev_rank_mmr + '\n'
              + '**현재 MMR**: ' + mmr + '\n'
              + '**다음 랭크**: ' + ((next_rank_mmr === 0) ? 'N/A' : next_rank_mmr)
          },
          {
            name: '경기',
            inline: true,
            value: '**승리**: ' + wins + '\n'
              + '**패배**: ' + losses + '\n'
              + '**승률**: ' + (losses === 0 ? 'n/a' : Number(wins / losses).toFixed(2)) + '\n'
              + '**탈주**: ' + abandons
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

  hydrateParamaters() {
    let username = this._args[0]
    var i = 1
    if (username.startsWith('"') || username.startsWith('“') || username.startsWith('”')) {
      while (!(username.endsWith('"') || username.endsWith('“') || username.endsWith('”')) && i < this._args.length - 1) {
        username += ' ' + this._args[i]
        i++
      }
      username = username.replace(/"/g, '').replace(/“/g, '').replace(/”/g, '')
    }
    this.platform = getPlatform(this._args[i].toLowerCase())
    let region, season
    let regionOrSeason = (this._args.length >= i ? this._args[i + 1] : null)
    const REGIONS = ['ncsa', 'na', 'emea', 'eu', 'apac', 'asia']
    let seasonCheck = (this._args.length >= i + 1 ? this._args[i + 2] : null)
    if (regionOrSeason) {
      if (REGIONS.includes(regionOrSeason.toLowerCase())) {
        region = regionOrSeason.toLowerCase()
      } else if (!Number.isNaN(parseInt(regionOrSeason))) {
        season = parseInt(regionOrSeason)
      }
      if (seasonCheck) season = parseInt(seasonCheck)
    }
    this.region = region
    this.season = season
    this.username = username
  }

  rankIconThumbnail (season, rank, championsRankPosition) {
    if (season >= 15) {
      return (rank === 23)
        ? `https://r6stats.com/api/dynamic/champions-rank-image/${championsRankPosition}`
        : `https://cdn.r6stats.com/seasons/rank-imgs/${RANKS_EMBER_RISE[rank].img.replace('svg', 'png')}`
    } else {
      return `https://cdn.r6stats.com/seasons/rank-imgs/${RANKS[rank].img.replace('svg', 'png')}`
    }
  }

  currentRankName (season, rank, championsRankPosition) {
    if (season >= 15) {
      return (rank === 23)
        ? `Champions (#${championsRankPosition})`
        : RANKS_EMBER_RISE[rank].name
    } else {
      return RANKS[rank].name
    }
  }

}

export default RankCommand
