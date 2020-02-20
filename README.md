# R6Stats Discord Bot

[DISCORD.js](https://discord.js.org/#/)로 만들어진 [R6Stats](https://r6stats.com)에서의 톰 클랜시의 레인보우 식스:시즈의 전적을 찾아주는 봇입니다. 

## 설치방법.
처음 설치할때

### Yarn 설치
[yarn Windows 버젼 다운로드 페이지](https://yarnpkg.com/en/docs/install#windows-stable)에서 플랫폼에 맞는 파일을 찾아서 다운받아 설치하세요.

### Yarn으로 프로젝트 실행하기
다운받은 폴더에서 명령 프롬포트를 열어서 다음 명령어를 실행하세요. (Yarn을 설치한 이후에 명령프롬포트를 실행해야합니다.)
```bash
yarn
```

### config.js 설정하기
`config.example.js` 파일을 복사하고 `config.js`으로 이름을 바꿔주세요.
`login` 을 r6stats 사이트의 아이디로 바꿔주세요.
`password` 를 r6stats 사이트의 비밀번호로 바꿔주세요.
`base_url` r6stats 사이트의 API 주소로 변경해주세요. (https://api.r6stats.com)
`token` 을 당신의 디스코드 봇의 토큰으로 변경해주세요. 만약에 봇을 생성하지 않았다면 [여기](https://discordapp.com/developers/applications/)에서 토큰을 발급받아주세요.

## 실행법

```bash
yarn start
```

## 개발 & 테스트용 실행

```bash
yarn run dev
```

## 디버깅
만약 아래와 같은 버그가 발생할경우
```
The term 'yarn' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

시스템 환경 변수에 있는 PATH에 추가가 되어있는지 확인해주세요.
모든 명령 프롬포트를 닫았는지 한번 더 확인해주세요.

만약 이 에러가 계속된다면 시스템을 재부팅해주세요.
