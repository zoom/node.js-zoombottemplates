let jwt = require('jsonwebtoken');
let moment = require('moment');
module.exports = async (req, res) => {
  let { zoomApp, zoomError, databaseModels } = res.locals;
  if (!zoomError) {
    let tokens = zoomApp.auth.getTokens(); //get zoom token
    let info = jwt.decode(zoomApp.auth.tokens.access_token); //parse token to multiple information
    if (databaseModels) {
      let time = moment().add(tokens.expires_in, 'seconds');
      try {
        await databaseModels.zoom.save({
          zoom_account_id: info.accountId,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_date: time.format()
        });
        res.render('index');
      } catch (e) {
        res.send('error');
        // console.log(e);
      }
    }
    /* 
      UserInfo:{
        clientId:string;
        code:string;
        userId:string;
        accountId:string;
        [propName: string]:string | number;  
      }
    */
  } else {
    res.send('error');
  }
};
