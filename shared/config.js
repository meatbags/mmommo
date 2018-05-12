const Config = {
  global: {
    maxDataSize: 400,
    maxMessageSize: 250,
    colours: {
      red: 0xff0000,
      green: 0x00ff00,
      blue: 0x0000ff
    }
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
    userMuteTimeout: 10,
    userMuteTimeoutIncrement: 5
  }
};

export { Config };
