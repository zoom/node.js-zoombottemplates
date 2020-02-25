let joi = require('@hapi/joi');

module.exports = {
  log:function(info){
    // console.log(info.type,info.message);
  },
  useDatabase: {
    lib: require('botdynamodb'),
    option: {
      tables: {
        zoom: {
          tableName: 'zoomtable',
          hashKey: 'zoom_account_id',
          schema: {
            zoom_account_id: joi.string(),
            access_token: joi.string(),
            refresh_token: joi.string(),
            expires_date:joi.string()
          }
        }
      },
      port: process.env.DB_PORT || 8089,
      region: process.env.DB_REGION || 'us-east-1'
    }
  },
  botCommands: [
    {
      command: 'help',
      callback: require('./src/help.js')
    },
    {
      command: 'meet',
      callback: require('./src/meet.js')
    },
    {
      command:'vote',
      callback:require('./src/vote')
    },
    {
      callback:require('./src/noCommand.js') // no right command,will call this function
    }
  ],
  botActions: [
    {
      command:'interactive_message_actions',
      callback:require('./src/interactive_message_actions.js')
    }
  ],
  apis: [
    { url: '/command', method: 'post', zoomType: 'command' },
    {
      url: '/auth',
      method: 'get',
      callback: require('./src/auth'),
      zoomType: 'auth'
    },
    {
      url:'/test',
      method:'get',
      callback:function(req,res){
        res.send('test success');
      }
    }
  ]
};
