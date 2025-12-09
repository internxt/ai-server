export const getConfig = (env: any) => {
  return {
    rateLimit: {
      maxRequests: 100,
      windowMs: 3600000,
    },

    validation: {
      maxMessages: 50,
      maxMessageLength: 2000,
      allowedRoles: ['system', 'user', 'assistant'] as const,
    },

    model: {
      maxTokens: 8000,
      defaultTemperature: 0.7,
      minTemperature: 0.0,
      maxTemperature: 1.0,
      frequencyPenalty: 0.5,
      presencePenalty: 0.3,
    },

    budget: {
      dailyTokenLimit: 500000,
      alertThreshold: 0.8,
    },

    timeout: {
      requestTimeout: 60000,
    },

    cors: {
      allowOrigin: '*',
      allowMethods: ['POST', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
    },

    ovh: {
      endpoint: env.OVH_EP_URL,
      model: env.OVH_MODEL_NAME,
    },
  } as const;
};