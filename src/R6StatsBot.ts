import container from '../inversify.config'
import { decorate, injectable } from 'inversify'
import { ServiceTypes } from './types'

import { Client } from 'discord.js'

import BotConfig from './BotConfig'

import ConfigProvider from './providers/ConfigProvider'
import R6StatsAPIProvider from './providers/R6StatsAPIProvider'
import CommandRegistrar from './CommandRegistrar'

import CommandHandler from './handlers/CommandHandler'
import ErrorHandler from './handlers/ErrorHandler'
import ReadyHandler from './handlers/ReadyHandler'

class R6StatsBot {
  client: Client

  constructor () {
    this.client = new Client()

    decorate(injectable(), Client)

    container.bind<Client>(ServiceTypes.DiscordClient).toConstantValue(this.client)
    container.bind<CommandRegistrar>(ServiceTypes.CommandRegistrar).to(CommandRegistrar)
    container.bind<CommandHandler>(ServiceTypes.CommandHandler).to(CommandHandler)
    container.bind<ErrorHandler>(ErrorHandler).toSelf()
    container.bind<ReadyHandler>(ReadyHandler).toSelf()

    this.setupHandlers()
    this.registerProviders()
    this.loadCommands()
    this.login()
  }

  setupHandlers () {
    container.get<CommandHandler>(ServiceTypes.CommandHandler).setup()
    container.get<ErrorHandler>(ErrorHandler).setup()
    container.get<ReadyHandler>(ReadyHandler).setup()
  }

  registerProviders () {
    const PROVIDERS = [
      ConfigProvider,
      R6StatsAPIProvider
    ]

    PROVIDERS.forEach(ProviderClass => {
      const instance = new ProviderClass()
      instance.boot()
      instance.register()
    })
  }

  login () {
    const config = container.get<BotConfig>(ServiceTypes.Config)
    this.client.login(config.discordToken)
  }

  async loadCommands () {
    const registrar = container.get<CommandRegistrar>(ServiceTypes.CommandRegistrar)

    registrar.registerDirectory('commands')
  }

}

export default new R6StatsBot()
