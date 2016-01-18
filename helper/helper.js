/**
 * Created by mkash32 on 18/1/16.
 */
var crypto = require('crypto');
var http = require('http');

module.exports.sendAuthReq = function sendAuthenticationRequest(){
    var requestData = buildAuthenticationRequest();
    var options = {
        host: 'auth.uidai.gov.in',
        path: requestData.path,
        method: 'GET',
        headers: {
            "Content-Type":"application/xml"
        },

    };
}

function buildAuthenticationRequest(req){
    var url = URLbuilder(true,req.params.uid);

    var inputData = {};

    return inputData;
}


//url will be of the form https://<host>/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>
//public is a boolean for testing/development url
//uid is the aadhaar number
function URLbuilder(public,uid){        // puboolean for testing/development url vs production

    if(public)
        return developmentURL(uid);
    else
        return productionURL(uid);
}

function developmentURL(uid){
    var url = constants.url_template;
    url = url.replace("<host>","auth.uidai.gov.in");
    url = url.replace("<ver>",constants.currentAPIVersion);
    url = url.replace("<ac>","public");
    url = url.replace("<uid[0]>",uid.charAt(0));
    url = url.replace("<uid[1]>",uid.charAt(1));
    //url = url.replace("<asalk>",)    //still to add
    return url;
}

function productionURL(uid){
    //not at production stage
}

//dynamically generated key for each transaction
//256-bit AES dynamic session key which is to be encrypted
//IMPORTANT: Errors may arise due to initialization Vector

function encryptPID(inputData){
    var Skey = crypto.randomBytes(32);   //256 bits
    var initializationVector = crypto.randomBytes(16);

    inputData.skey = Skey;

    var cipher = crypto.createCipheriv('aes-256-ctr',Skey,initializationVector);
    cipher.update(inputData.pidXML,'utf8','base64');
    var pid = cipher.final('base64');

    Console.log(pid);
    inputData.pid = pid;
}

function createHmac(inputData){
    var key = inputData.skey;
    var hmac = crypto.createHmac('sha256',key);

    hmac.update(inputData.pidXML);
    inputData.hmac = hmac.digest('base64');
}