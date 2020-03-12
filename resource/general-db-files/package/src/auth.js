let moment = require('moment');
module.exports = async (req, res) => {
  let { zoomApp, zoomError, databaseModels,request } = res.locals;
  if (!zoomError) {
    let tokens = zoomApp.auth.getTokens(); //get zoom token
    if (databaseModels) {
      let time = moment().add(tokens.expires_in, 'seconds');
      try {
        let userInfo = await zoomApp.request({url:'/v2/users/me', method:'get'});
        await databaseModels.zoom.save({
          zoom_account_id: userInfo.account_id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_date: time.format()
        });
        res.render('index');
      } catch (e) {
        res.send('error');
      }
    }
  } else {
    res.send('error');
  }
};
