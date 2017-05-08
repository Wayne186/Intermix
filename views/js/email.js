var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


module.exports=function(name,email,subject,body){
	
  var transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: { user: 'intermixservices@gmail.com',
        pass: 'cs307307' }
  }));

  transporter.sendMail({
    from: 'Admin <intermixservices@gmail.com>',
    to: email,
    subject: subject,
    text: body
  }, function (error, response) {
    //Email not sent
    if (error) {
      console.log("Email send failed");
      console.log(error)
    }
    //email send sucessfully
    else {
      //console.log(response);
    }
  })}