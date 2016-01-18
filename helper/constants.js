/**
 * Created by mkash32 on 18/1/16.
 */

module.exports.url_template = 'https://<host>/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>';
module.exports.currentAPIVersion = '1.6';   //current version of the Aadhaar Auth API, if API is updated then this constant should be changed

//txn :- transaction id for AUA
//lk: -liscense key, assigned to the AUA. Available on Administration portal
//Lot :- G or P depending on whether to giv lat/long or postal code
//type :- PID type

module.exports.public_config_attrs = {
    "ac":"public",
    "sa":"public",
    "tid":"public",
    "ver": "1.6",
    "txn": "TBD",
    "lk": "TBD",
    "pi": "y",
    "udc": "TBD",
    "fdc": "NA",
    "idc": "NA",
    "pip": "NA",
    "lot": "P",
    "type":"X"
};