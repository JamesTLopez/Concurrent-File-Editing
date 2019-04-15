const jwt = require('jsonwebtoken');
const config = require('config');
const cookieParser = require('cookie-parser')
const cookieSecret ='thelandbeforetime';



function auth(req,res,next){
  const token = req.cookies.auth;
  if(!token){
    res.render('loginconfirmation',{
      error:'STATUS(401): Access denied. No token provided'
    });
  }
  try{

    // const payload = jwt.verify(token, config.get('jwt'));
      const payload = jwt.verify(token, '1234');
    req.user = payload;
    next();

  }catch(ex){
    res.status(400).send('Invalid token');
    res.render('loginconfirmation',{
      error:'STATUS(400): Invalid token'
    });
    next();
  }


}

module.exports = auth;
