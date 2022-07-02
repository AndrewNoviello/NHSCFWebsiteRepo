function sendEmailHTML(from, to, subject, message, cc, bcc, attachments) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nhsclimateforum@gmail.com',
            pass: 'abnoviello23'
            }
    });
  
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: message,
        cc: cc,
        bcc: bcc,
        attachment: attachments
    };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}