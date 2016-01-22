/**
 * Created by mkash32 on 21/1/16.
 */
var nodeRSA = require('node-rsa');
var crypto = require('crypto');

//dynamically generated key for each transaction
//256-bit AES dynamic session key which is to be encrypted
//IMPORTANT: Errors may arise due to initialization Vector

//return JSON object {skey:,encryptedSkey:,encryptedPid:,hmac:}
module.exports.encryptPid = function encryptPID(pid){
    var Skey = crypto.randomBytes(32);   //256 bits
    var initializationVector = crypto.randomBytes(16);

    var returnData = {};
    returnData.skey = Skey;

    var cipher = crypto.createCipheriv('aes-256-ctr',Skey,initializationVector);
    cipher.update(pid,'utf8','base64');
    var encryptedPid = cipher.final('base64');

    returnData.encryptedPid = encryptedPid;

    returnData.hmac = createHmac(Skey,pid);
    returnData.encryptedSkey = encryptWithPublicKey(Skey);

    return returnData;
}

function createHmac(skey,pid){
    var hmac = crypto.createHmac('sha256',skey);

    hmac.update(pid);
    var hmac = hmac.digest('base64');
    return hmac;
}

//timestamp should be in the format YYYY-MM-DDThh:mm:ss (ISO 8601) standard
//take the unix time as the input
function formatTimeStamp(unixTimeStamp){
    //In this case, server is making the stamp, normally device should create the stamp on capturing of data
    var date = new Date(unixTimestamp * 1000);

    var hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDate();

    //formatting to YYYY-MM-DDThh:mm:ss
    var formattedStamp = year+"-"+(month+1<10?"0":"")+(month+1)+"-"+
        (day<10?"0":"")+day+"T"+(hours<10?"0":"")+hours+":"+
        (minutes<10?"0":"")+minutes+":"+(seconds<10?"0":"")+seconds;
    console.log(format);

    return formattedStamp;
}

function encryptWithPublicKey(skey)
{
    //lodaing PEM public key
    //if certificate changes be sure to change this according to the new public key
    var key = new nodeRSA("-----BEGIN PUBLIC KEY-----" +
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxgVhHZZwTbiBMbu6zPzp" +"\n"+
        "NRfVp7ldubZvqPuKWT77UhR8pUUiBW7f19P+Ox6Er6K6F/hoMWzz2k8geVEqFoRb" +"\n"+
        "VUVTfxxoxBkisQ82WCpbG0KkPNGyZ9i/56Aslq/bwfSbyH6rfpAqLjFu9BXw4W+S" +"\n"+
        "Y1zTKIjkxCjTh4FbqgzpFkGVlV3Al98ODrlS7uuyX+qeqjvDZ3HQ+MzejrbNn6TQ" +"\n"+
        "RBLaaqCVlkSzrzejXyEqaqliwVOVqNI3YPde7Mjl4p6yGJ9T5Z4SGXSQXXP542kb" +"\n"+
        "xblcWn+inQvEmLCs3na841KflFRnFcMw27NDH1KQL8IZZByu56KE6BOIidcqoFF2" +"\n"+
        "aQIDAQAB" +"\n"+
        "-----END PUBLIC KEY-----");

    var encryptedSkey = key.encrypt(skey,'base64');

    return encryptedSkey;
}