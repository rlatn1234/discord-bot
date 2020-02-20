import BaseCommand from '../BaseCommand'

class HelpCommand extends BaseCommand {
  constructor ({ }) {
    super(...arguments)
  }

  shouldInvoke () {
    return this._command === 'help'
  }

  invoke () {
    this.reply({
      embed: {
        color: 3447003,
        title: 'NOBLE R6S STATS BOT 도움말',
        description: '<...>로 표시된것들은 필수입니다. {...} 로 표시된것들은 필수적이지 않습니다.',
        thumbnail: {
          url: 'https://i.imgur.com/gIX3Iih.png',
        },
        fields: [
          {
            name: '전적',
            inline: true,
            value: '**일반 전적**: r6s stats <닉네임> <플랫폼> {general|ranked|casual}\n' +
              '**시즌/랭크 전적**: r6s rank <닉네임> <플랫폼> {지역: ncsa|na|emea|eu|apac|asia} {시즌}\n' +
              '**오퍼레이터 전적**: r6s operator <닉네임> <플랫폼> <오퍼레이터>'
          },
          {
            name: '기타',
            inline: true,
            value: '**랜덤 오퍼레이터**: r6s randomop <역할>\n' +
              '**핑**: r6s ping\n' +
              '**초대 링크**: r6s invite'
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
}


export default HelpCommand
