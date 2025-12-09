
export const CONFIG = {

  rateLimit: {
    maxRequests: 20,        
    windowMs: 3600000,    
  },

 
  validation: {
    maxMessages: 20,              
    maxMessageLength: 2000,       
    allowedRoles: ['system', 'user', 'assistant'] as const,
  },

  model: {
    maxTokens: 1000,             
    defaultTemperature: 0.6,     
    minTemperature: 0.0,          
    maxTemperature: 1.0,          
    frequencyPenalty: 0.5,        
    presencePenalty: 0.3,      
  },

  budget: {
    dailyTokenLimit: 100000,      
    alertThreshold: 0.8,          
  },

  timeout: {
    requestTimeout: 30000,        
  },


  cors: {
    allowOrigin: '*',                     
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  },


  ovh: {
    endpoint: 'https://gpt-oss-120b.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions',
    model: 'gpt-oss-120b',
  },
} as const;