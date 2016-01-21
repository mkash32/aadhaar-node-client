/**
 * Created by mkash32 on 18/1/16.
 */
var crypto = require('crypto');
var http = require('http');
var builder = require('xmlbuilder');
var nodeRSA = require('node-rsa');

module.exports.sendAuthReq = function sendAuthenticationRequest(){
    var requestData = buildAuthenticationRequest();
    var xml = buildXmlInput(requestData);

    var options = {
        "host": constants.public_config_attrs.host,
        "path": requestData.path,
        "method": 'GET',
        "headers": {
            "Content-Type":"application/xml"
        }
    };

}

function buildAuthenticationRequest(req){
    var path = pathBuilder(true,req.params.uid);

    var inputData = {};

    return inputData;
}


// url will be of the form https://<host>/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>
// public is a boolean for testing/development url
// uid is the aadhaar number
function pathBuilder(public,uid){        // boolean for testing/development url vs production

    if(public)
        return developmentURL(uid);
    else
        return productionURL(uid);
}

function developmentURL(uid){

    //var url = constants.url_template;
    //url = url.replace("<host>","auth.uidai.gov.in");
    //url = url.replace("<ver>",constants.currentAPIVersion);
    //url = url.replace("<ac>","public");
    //url = url.replace("<uid[0]>",uid.charAt(0));
    //url = url.replace("<uid[1]>",uid.charAt(1));

    url = url.replace("<asalk>",constants.public_config_attrs.asalk);
    var path = "/"+constants.currentAPIVersion+"/public/"+uid.charAt(0)+"/"+uid.charat(1)+"/"+constants.public_config_attrs.asalk;
    return path;
}

function productionURL(uid){
    //not at production stage
}
function buildXmlInput(requestData)
{
    var xmlBuilder = builder.create('Auth');
    var authAttr = {
        "uid":requestData.uid,
        "tid":constants.public_config_attrs.tid,
        "ac":constants.public_config_attrs.ac,
        "sa":constants.public_config_attrs.sa,
        "ver":constants.public_config_attrs.ver,
        "txn":constants.public_config_attrs.txn,
        "lk":constants.public_config_attrs.lk
    };

    xmlBuilder.attribute(authAttr);

    var xml = xmlBuilder.ele("Uses",constants.basic_uses_attrs,null)
        //.ele("Meta",,null)
        .ele("Skey",{ci:constants.public_config_attrs.ci},requestData.skey)
        .ele("Data",{type:"X"},requestData.pid)
        .ele("Hmac",null,requestData.hmac)
        //.ele("Signature")     //not sure if this is needed
        .end();

    Console.log(xml);
    return xml;
}

function buildPidXML(req){
    var pidXmlBuilder = builder.create('Pid');
        pidXmlBuilder.attribute({ts:req.params.timeStamp, ver:"1.0"});

    pidXmlBuilder.element("Demo")
                    .element("Pi",{ms:"P",mv:100,name:req.params.name});    //just including name matching for now

    return pidXmlBuilder.end();
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

//SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddhhmmssSSS");
//String txn = "AuthDemoClient" + ":" + aua + ":" + dateFormat.format(new Date());
//return txn;

//timestamp should be in the format YYYY-MM-DDThh:mm:ss
function formatTimeStamp(timestamp){

}

function encryptWithPublicKey(inputData)
{
    //lodaing PEM public key
    //if certificate changes be sure to change this according to the new public key
    var key = new nodeRSA("-----BEGIN CERTIFICATE-----\n"+
        "MIIDBjCCAe6gAwIBAgIEATMzfzANBgkqhkiG9w0BAQUFADA7MQswCQYDVQQGEwJJ\n"+
        "TjEOMAwGA1UEChMFVUlEQUkxHDAaBgNVBAMTE0F1dGhTdGFnaW5nMTYwOTIwMjAw\n" +
        "HhcNMTUwOTE2MDAwMDAwWhcNMjAwOTE2MDAwMDAwWjA7MQswCQYDVQQGEwJJTjEO\n" +
        "MAwGA1UEChMFVUlEQUkxHDAaBgNVBAMTE0F1dGhTdGFnaW5nMTYwOTIwMjAwggEi\n" +
        "MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDGBWEdlnBNuIExu7rM/Ok1F9Wn\n" +
        "uV25tm+o+4pZPvtSFHylRSIFbt/X0/47HoSvoroX+GgxbPPaTyB5USoWhFtVRVN/\n" +
        "HGjEGSKxDzZYKlsbQqQ80bJn2L/noCyWr9vB9JvIfqt+kCouMW70FfDhb5JjXNMo\n" +
        "iOTEKNOHgVuqDOkWQZWVXcCX3w4OuVLu67Jf6p6qO8NncdD4zN6Ots2fpNBEEtpq\n" +
        "oJWWRLOvN6NfISpqqWLBU5Wo0jdg917syOXinrIYn1PlnhIZdJBdc/njaRvFuVxa\n" +
        "f6KdC8SYsKzedrzjUp+UVGcVwzDbs0MfUpAvwhlkHK7nooToE4iJ1yqgUXZpAgMB\n" +
        "AAGjEjAQMA4GA1UdDwEB/wQEAwIFoDANBgkqhkiG9w0BAQUFAAOCAQEAT3l/ShgP\n" +
        "46+Ctqrp/WIzheslpxvsSWpD2jwWvinXujXY6Vsc77gPQUsQawKNY0p4h9j8MDSN\n" +
        "b8oYY8i7NxxH6kPuIjzoRNJtA1jiKANdFNuEPK9h4wETBlEfgU0yOdWer7inQO3S\n" +
        "6pH8eGChhOHxmIqBGIfnjoWq8RbIdRrj4E/xkvvZpVj2Vp1MPyQoVJSQ+tZIAwLH\n" +
        "tzcs7UUJUoGyII8egKDX1NFdvRM62wzfCyx5J1wSSaCZ2V/lr7CmTmHcbC04K3BN\n" +
        "N5Yby7FxmU5NNrTvW1ZPLVXpvo9hBfnRc+L75PPpoBV9V54wSzsn0rDKjYcpniYT\n" +
        "cpm09Ae8SAS0vg==\n"+
    "-----END CERTIFICATE-----");

    var skey = key.encrypt(inputData.skey,'base64');

    inputData.skey = skey;
}

function signXML(inputData)
{

}