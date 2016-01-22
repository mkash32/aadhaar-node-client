/**
 * Created by mkash32 on 18/1/16.
 */
var http = require('http'),
    sig = require('./DigitalSignature'),
    constants = require('./constants'),
    XmlBuilders = require('./XmlBuilders');

module.exports.sendAuthReq = function sendAuthenticationRequest(req){

    if(!(req.params.uid && req.params.time_stamp && req.params.name))
    {
        console.log("Invalid parameters");
        return;
    }

    console.log(req.params.uid +" "+req.params.time_stamp+" "+req.params.name);

    var xml = XmlBuilders.buildXmlInput(req);
    var finalRequestXml = sig.signXML(xml);

    var options = {
        "host": constants.public_config_attrs.host,
        "path": developmentUrlPath(req.params.uid),
        "method": 'POST',
        "headers": {
            "Content-Type":"application/xml"
        }
    };

    var req = http.request(options,function(res){
        console.log(res.statusCode);
        var buffer;
        res.on( "data", function( data ) {
            buffer = buffer + data;
            console.log('data');
        });
        res.on( "end", function( data ) {
            console.log( buffer );
            console.log('print buffer');
        });
    });

    req.on('error',function(err){
       console.log(err.message);
    });

    console.log('about to send');
    console.log(finalRequestXml);
    req.write(finalRequestXml);
    req.end();

    var options2 = {
        "host": "google.com",
        "path": null,
        "method": 'GET',
    };

    var req2 = http.request(options,function(res){
        console.log(res.statusCode);
        var buffer;
        res.on( "data", function( data ) {
            buffer = buffer + data;
            console.log('data');
        });
        res.on( "end", function( data ) { console.log( buffer );
            console.log('print buffer');} );
    });

    req2.on('error',function(err){
        console.log(e.message);
    });
    console.log('about to get google');
    req2.end();

};

function generateAuthenticationRequest(req){
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

function developmentUrlPath(uid){

    //var url = constants.url_template;
    //url = url.replace("<host>","auth.uidai.gov.in");
    //url = url.replace("<ver>",constants.currentAPIVersion);
    //url = url.replace("<ac>","public");
    //url = url.replace("<uid[0]>",uid.charAt(0));
    //url = url.replace("<uid[1]>",uid.charAt(1));
    //
    //url = url.replace("<asalk>",constants.public_config_attrs.asalk);
    var path = "/"+constants.currentAPIVersion+"/public/"+uid.charAt(0)+"/"+uid.charAt(1)+"/"+constants.public_config_attrs.asalk;
    return path;
}

function productionURL(uid){
    //not at production stage
}
