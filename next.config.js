// This file was auto-created and injected by v0.
// DO NOT MODIFY THIS FILE DIRECTLY.
// EDIT THE USER CONFIG IN ./next.user-config.js INSTEAD.

const userConfigImport = require('./next.user-config.js')
const path = require('path')

const userConfig = typeof userConfigImport === 'function'
  ? userConfigImport('phase-development-server', { defaultConfig: {} })
  : userConfigImport

const config = {
  ...userConfig,
  devIndicators: false,
  images: {
    ...userConfig.images,
    unoptimized: process.env.NODE_ENV === 'development',
  },
  logging: {
    ...userConfig.logging,
    fetches: { fullUrl: true, hmrRefreshes: true },
    browserToTerminal: true,
  },
  experimental: {
    ...userConfig.experimental,
    serverActions: {
      ...userConfig.experimental?.serverActions,
      allowedOrigins: [
        ...(userConfig.experimental?.serverActions?.allowedOrigins || []),
        '*.vusercontent.net',
      ],
    },
  },
  allowedDevOrigins: [
    ...(userConfig.allowedDevOrigins || []),
    '*.vusercontent.net',
    '*.dev-vm.vusercontent.net',
  ],
}

module.exports = config
