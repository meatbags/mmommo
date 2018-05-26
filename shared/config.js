const Config = {
  global: {
    hudSize: 360,
    maxDataSize: 400,
    maxMessageSize: 250,
    grid: {
      size: 512,
      step: 2.5,
      playerSpawnRange: 96 // from centre
    },
  },
  client: {
    emitMovementRate: 4,
    emitMovementPeriod: 1,
    emitPingRate: 1,
    emitPingPeriod: 5,
  },
  server: {
    limitRequestRate: 10,
    limitRequestPeriod: 1,
    limitSpamRate: 5,
    limitSpamPeriod: 5,
    limitBroadcastRate: 8,
    limitBroadcastPeriod: 1,
    limitBroadcastPaintRate: 5,
    limitBroadcastPaintPeriod: 1,
    userMuteTimeout: 10,
    userMuteTimeoutIncrement: 5
  }
};

export { Config };
