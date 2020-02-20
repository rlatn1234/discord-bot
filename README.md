# R6Stats Discord Bot

This bot is built with [DISCORD.js](https://discord.js.org/#/) to retrieve and display Rainbow Six: Siege stats from [R6Stats](https://r6stats.com)

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
`config.example.js`파일을 복사하고 `config.js`으로 이름을 바꿔주세요.
`login`을 r6stats 사이트의 아이디로 바꿔주세요.
`password`를 r6stats 사이트의 비밀번호로 바꿔주세요.
replace `base_url` with the API endpoint of r6stats
replace `token` with your discord bot token, if you do not have one, create one [here](https://discordapp.com/developers/applications/)

## 실행법

```bash
yarn start
```

## 개발 & 테스트용 실행

```bash
yarn run dev
```

## 디버깅
If you run into an error that says
```
The term 'yarn' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

Check your PATH system enviroment variables.
Make sure you closed all the command-lines.

If the error still accures, restart your device, it should work after.
