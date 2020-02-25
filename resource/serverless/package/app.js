let express = require('express');
const bodyParser = require('body-parser');
var compression = require('compression');
let nodepath=require('path');
let botConfig = require('./botConfig');
let botservice = require('@zoomus/botservice');
let expressApp = express();
let cors = require('cors')
let hbs = require('./hbs');
const cookieParser = require('cookie-parser')
let router = express.Router();

//middleware body
expressApp.use(bodyParser.json());
expressApp.use(cookieParser());
expressApp.use(
  bodyParser.urlencoded({
    extended: false
  })
);

expressApp.use(compression());
if(process.env.NODE_ENV==='development'){
  expressApp.use(cors());
}
expressApp.use(`/`,router);

botservice(router, botConfig);

let rootDir=nodepath.resolve('views/assets');
expressApp.use(express.static(rootDir));

expressApp.set('view engine','hbs');
hbs.registerPartials(nodepath.resolve('views'));


module.exports=expressApp;

