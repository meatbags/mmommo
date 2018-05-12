const Config = {
  limit: {
    client: {
      movement: {
        rate: 5,
        period: 1
      },
      ping: {
        rate: 1,
        period: 5
      }
    },
    server: {
      request: {
        rate: 10,
        period: 1
      },
      broadcast: {
        rate: 8,
        period: 1
      },
      spam: {
        rate: 5,
        period: 5
      },
    }
  },
  maxDataSize: 500,
  maxMessageSize: 250,
  muteTimeout: 10,
  muteTimeoutIncrement: 5
};

export { Config };
