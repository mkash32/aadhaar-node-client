/**
 * Created by mkash32 on 21/1/16.
 */

var builder = require('xmlbuilder'),
    encryptionUtils = require('./EncryptionUtils'),
    constants = require('./constants.js');

module.exports.buildXmlInput = function buildXmlInput(req)
{
    var xmlBuilder = builder.create('Auth');

    //txn is optional in 1.5
    var authAttr = {
        "uid":req.params.uid,
        "tid":constants.public_config_attrs.tid,
        "ac":constants.public_config_attrs.ac,
        "sa":constants.public_config_attrs.sa,
        "ver":constants.public_config_attrs.ver,
    //    "txn":constants.public_config_attrs.txn,
        "lk":constants.public_config_attrs.lk
    };

    xmlBuilder.attribute(authAttr);

    var pid = buildPidXML(req);
    console.log(pid);
    var requestData = encryptionUtils.encryptPid(pid);


    //currently using 1.5 which has meta tag as 'optional'
    //var metaAttr = {
    //    "udc":,
    //    "fdc":,
    //    "idc":,
    //    "pip":,
    //    "lot":,
    //    "lov":,
    //}

    var xml = xmlBuilder.ele("Uses",constants.basic_uses_attrs,null)
    //    .ele("Meta",mettaAttr,null)
        .ele("Skey",{ci:constants.public_config_attrs.ci},requestData.encryptedSkey)
        .ele("Data",{type:"X"},requestData.encryptedPid)
        .ele("Hmac",null,requestData.hmac)
        .end();

    console.log(xml);
    return xml;
}

function buildPidXML(req){
    var pidXmlBuilder = builder.create('Pid',{version: '1.0', encoding: 'UTF-8', standalone: true},
    {pubID: null, sysID: null},
    {allowSurrogateChars: false, skipNullAttributes: false,
        headless: true, ignoreDecorators: false,
        separateArrayItems: false, noDoubleEncoding: false,
        stringify: {}});
    var timeStamp = formatTimeStamp(req.params.time_stamp);
    pidXmlBuilder.attribute({ts:timeStamp, ver:"1.0"});

    pidXmlBuilder.element("Demo")
        .element("Pi",{ms:"P",mv:100,name:req.params.name});    //just including name matching for now

    return pidXmlBuilder.end();
}

//timestamp should be in the format YYYY-MM-DDThh:mm:ss (ISO 8601) standard
//take the unix time as the input
function formatTimeStamp(unixTimeStamp){
    //In this case, server is making the stamp, normally device should create the stamp on capturing of data
    var date = new Date(unixTimeStamp * 1000);

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
    console.log(formattedStamp);

    return formattedStamp;
}