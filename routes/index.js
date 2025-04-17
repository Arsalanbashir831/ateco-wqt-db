var express = require('express');
const User = require('../models/userModel')
const Report = require('../models/reportModel')
const Card = require('../models/cardModel')
const Certificate = require('../models/certificateModel')
const session = require('express-session')

var router = express.Router();

router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

router.get('/', function (req, res, next) {
  req.session.destroy();
  res.render("authentication")
});
router.get('/supervisor', async (req, res) => {
  if (req.session.user==='supervisor') {
   
  const cardData = await Card.find().exec()
  const reportData = await Report.find().exec()
  const certificateData = await Certificate.find().exec()

  console.log("---------------- card DATA---------------------")
  console.log(cardData);
  console.log("---------------- card DATA END--------------------")

  // console.log("---------------- report DATA---------------------")
  // console.log(reportData);
  // console.log("---------------- report DATA END--------------------")

  // console.log("---------------- certificate DATA---------------------")
  // console.log(certificateData);
  // console.log("---------------- certificate DATA END--------------------")


  res.render('Supervisor', { "cardData": cardData, "reportData": reportData, "certificateData": certificateData })
   
}else{
  res.redirect('/')
}
})


router.get('/inspector', async (req, res) => {
if (req.session.user==='inspector') {
  const reportData = await Report.find().exec()
  res.render('inspector', { "reportData": reportData });
}else{
  res.redirect('/')
}
})

router.post('/auth', async function (req, res) {
  console.log(req.body);

  if (req.body.user_role === 'supervisor') {
    // Hardcoded login check
    if (req.body.id === 'user123' && req.body.password === 'supervisor1@3') {
      console.log('Supervisor authenticated successfully');
      req.session.user = "supervisor";
      console.log("Session: " + req.session.user);
      res.redirect('/supervisor');
    } else {
      console.log('Supervisor credentials incorrect');
      res.redirect('/');
    }
  }

  if (req.body.user_role === 'inspector') {
    console.log("Inspector login attempt");
    let user = false;
    if (req.body.id === "user456" && req.body.password === "inspector1@3") {
      user = true;
    }

    if (user) {
      console.log('Inspector authenticated successfully');
      req.session.user = "inspector";
      res.redirect('/inspector');
    } else {
      console.log('Inspector credentials incorrect');
      res.redirect('/');
    }
  }
});


module.exports = router;
