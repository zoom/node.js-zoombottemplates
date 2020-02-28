let moment = require('moment');

module.exports = async (req, res) => {
  let { zoomApp, zoomError, zoomWebhook, databaseModels,request } = res.locals;
  if (!zoomError) {
    let { type, payload } = zoomWebhook;
    let { toJid, userJid, userId, accountId } = payload;
    try {
      let item = await databaseModels.zoom.get({
        zoom_account_id: accountId
      });
      
      zoomApp.auth.setTokens({
        access_token: item.get('access_token'),
        refresh_token: item.get('refresh_token'),
        expires_date: item.get('expires_date')
      });

      zoomApp.auth.callbackRefreshTokens(async function(tokens,error) {
        if(error){
          //try use refresh token to get access_token,but also fail,refresh token is invalid
        }
        else{
          try {
            await databaseModels.zoom.update({
              zoom_account_id: accountId,
              refresh_token: tokens.refresh_token,
              access_token: tokens.access_token,
              expires_date: moment().add(
                tokens.expires_in,
                'seconds'
              ).format()
            });
          } catch (e) {
            console.log(e);
          }

        }

      });

      let meetingInfo = await zoomApp.request({
        url: `/v2/users/${userId}/meetings`,
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: {
          topic: `New ${process.env.app} Meeting`,
          type: 2,
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            enforce_login: true,
            mute_upon_entry: true
          }
        }
      });

      await zoomApp.sendMessage({
        to_jid: toJid,
        account_id: accountId,
        user_jid: userJid,
        is_visible_you: true,
        content: {
          head: {
            type: 'message',
            text: `Zoom Meeting`,
            style: {
              bold: true
            }
          },
          body: [
            {
              type: 'message',
              text: 'Click to join the meeting',
              link: `${meetingInfo.join_url}`
            }
          ]
        }
      });
      res.send('success');
    } catch (e) {
      res.send('fail');
    }
  } else {
    res.send('fail');
  }
};
