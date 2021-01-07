module.exports = {
  'port':3600,
  'jwt_secret':'Lams4oMabietDuok',
  'permissionLevels':{
    'NORMAL_USER':1,
    'PAID_USER':4,
    'ADMIN':2048,
  },
  'facebook_clientID': '2208130679331550', //Điền App ID của bạn vào đây
  'facebook_clientSecret': '428765a6df70c3336dd277f907b5d9ab', //Điền App Secret ở đây
  'facebook_callbackURL': 'http://localhost:3600/api/auth/facebook/callback',

  'google_clientID': '886952481398-17os0ehe2gotsm2bs2masr3j8uk7t2eu.apps.googleusercontent.com',
  'google_clientSecret': '1OXUaDJrc7dvm6NIjO13jchB',
  'google_callbackURL': 'http://localhost:3600/api/auth/google/callback',

  'github_clientID': '893fa86dd344710cbecc',
  'github_clientSecret': 'd69d10ad1765bb6f80b4725f0be1026ae4af3129',
  'github_callbackURL': 'http://localhost:3600/api/auth/github/callback',

  'linkedin_clientID': '86ecg5leaijyta',
  'linkedin_clientSecret': 'L1k6U67jBH0iKVD0',
  'linkedin_callbackURL': 'http://localhost:3600/api/auth/linkedin/callback',

  'amazon_clientID': 'amzn1.application-oa2-client.16e8639619e54d0c82b463503d4b7334',
  'amazon_clientSecret': 'b7ebe27cd202b7ef9f3b6cecbb7e7fee1a23589ac0a63638dcda94a32e01917c',
  'amazon_callbackURL': 'http://localhost:3600/api/auth/amazon/callback'
}