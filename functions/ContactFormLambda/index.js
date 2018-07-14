'use strict';
console.log('Loading function');
const AWS = require('aws-sdk');
const sesClient = new AWS.SES();
const sesConfirmedAddress = "<your-verified-ses-email>";

/**
 * Lambda to process HTTP POST for contact form with the following body
 * {
      "email": <contact-email>,
      "subject": <contact-subject>,
      "message": <contact-message>
    }
 *
 */
exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var emailObj = JSON.parse(event.body);
    var params = getEmailMessage(emailObj);
    var sendEmailPromise = sesClient.sendEmail(params).promise();
    
    var response = {
        statusCode: 200
    };
    
    sendEmailPromise.then(function(result) {
        console.log(result);
        callback(null, response);
    }).catch(function(err) {
        console.log(err);
        response.statusCode = 500;
        callback(null, response);
    });
};

function getEmailMessage (emailObj) {
    var emailRequestParams = {
        Destination: {
          ToAddresses: [ "vipinmittalji2702@gmail.com" ]  
        },
        Message: {
            Body: {
                Text: {
                    Data: emailObj.message
                }
            },
            Subject: {
                Data: emailObj.subject
            }
        },
        Source: "vipinmittalji@gmail.com",
        ReplyToAddresses: [ emailObj.email ]
    };
    
    return emailRequestParams;
}
