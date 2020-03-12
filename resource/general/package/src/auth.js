
module.exports = async (req, res) => {
  let { zoomApp, zoomError,databaseModels,request} = res.locals;
  if (!zoomError) {
    res.render('index');
  }
  else{
    res.send('error in auth');
  }
};
