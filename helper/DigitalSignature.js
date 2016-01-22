/**
 * Created by mkash32 on 20/1/16.
 */
var SignedXml = require('xml-crypto').SignedXml,
    FileKeyInfo = require('xml-crypto').FileKeyInfo,
    builder = require('xmlbuilder'),
    fs = require('fs');

//should be extracted manually from sig.crt.pem
//may cause error due to spacing issue
var PUBLIC_KEY = "MIIDvTCCAqWgAwIBAgIGWXyspv4MMA0GCSqGSIb3DQEBBQUAMIGSMQswCQYDVQQG"+"\n"+
    "EwJJTjELMAkGA1UECBMCS0ExEjAQBgNVBAcTCUJhbmdhbG9yZTEOMAwGA1UEChMF"+"\n"+
    "VUlEQUkxGTAXBgNVBAsTEFN0YWdpbmcgU2VydmljZXMxNzA1BgNVBAMTLlNlbGYg"+"\n"+
    "U2lnbmVkIFJvb3QgQ0EgZm9yIFVJREFJIFN0YWdpbmcgU2VydmljZXMwHhcNMTIw"+"\n"+
    "NTI0MTEwMjM0WhcNMTYwNTI0MTEwMjM0WjCBiDELMAkGA1UEBhMCSU4xCzAJBgNV"+"\n"+
    "BAgTAktBMRIwEAYDVQQHEwlCYW5nYWxvcmUxEzARBgNVBAoTClB1YmxpYyBBVUEx"+"\n"+
    "GTAXBgNVBAsTEFN0YWdpbmcgU2VydmljZXMxKDAmBgNVBAMTH1B1YmxpYyBBVUEg"+"\n"+
    "Zm9yIFN0YWdpbmcgU2VydmljZXMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK"+"\n"+
    "AoIBAQCRStGvcMgKjv+s8QWdHTYuIq0w30QW1LQ/ElIN/JGlcg2vmyfD6dnyNl2K"+"\n"+
    "nn8uDXeSL4ueTIdijv+u6gFnY7inoiXa5Un+E6yMtrhJhIZL5Fy54oJ+YTjqu8x2"+"\n"+
    "3Nva7dlHL+b/rWlJHKksy7ZhFTw+RdYqJHRlH6vJp6R+6yRGdHGiJQw6NF4SR1Cp"+"\n"+
    "a9GmTKhyaF+01RC6UQ4OaD4p7HECmPkCVtcyQVLKjgDJHDCXCmh7BpUq0c1EM7iB"+"\n"+
    "OSznr1R0FOFR/mA4RFA8nCMbCtscbTG471KzPD0yJLKV0ybahI0vtfcR4JGMjJFf"+"\n"+
    "ZzmSBh4MDNluQmCmSvAlQcW9zRSzAgMBAAGjITAfMB0GA1UdDgQWBBTqyNrEemYk"+"\n"+
    "wM6F9ytRIleyFvDedzANBgkqhkiG9w0BAQUFAAOCAQEAHaLyjaQZKbzVkOpOibK/"+"\n"+
    "oarvh3nX+mgZeVskku+Y7BWxbHYHKTt0Sj93Vbg+62pBZoa5kgx+c7CZuzwv+Z7k"+"\n"+
    "+0M5bQh73jA4UAXYHjNet+2XMZ+19/3tUQI6cI3vQKZXEvqAZNBhOwC5xcKI073R"+"\n"+
    "ItEdheWHo/uv/ppwaZ+KsfbqLWh9uR+Xl/ES9hIGRW4+1s5DAhgmQlJFcVnzZXTP"+"\n"+
    "OqgofWVEsZn1JQLzS6WmmslUkaHWdeqHsOsB6gW8UBnSpSDA/migz1WdWAScwk+9"+"\n"+
    "Z8umd6HKhKttHX3ESSBez/4EFbAWRxB+xdf91MTsBHKM2htPI9rrz64kU/Fr/M70"+"\n"+
    "9w==";

//should be manually extracted from sig.crt.pem 'friendlyName'
var subjectName = "CN=Public AUA for Staging Services,OU=Staging Services,O=Public AUA,L=Bangalore,ST=KA,C=IN";

//custom key info Provider
function AadhaarKeyInfo(){
    this.getKeyInfo = function(key,prefix){
        var x509XML = builder.create('X509Data',{version: '1.0', encoding: 'UTF-8', standalone: true},
            {pubID: null, sysID: null},
            {allowSurrogateChars: false, skipNullAttributes: false,
                headless: true, ignoreDecorators: false,
                separateArrayItems: false, noDoubleEncoding: false,
                stringify: {}})
            .ele('X509Certificate',null,PUBLIC_KEY)
            .up()
            .ele('X509SubjectName',null,subjectName)
            .end();
        return x509XML;
    }
    this.getKey = function(keyInfo){
    }
}

//signs and returns final xml to be sent
module.exports.signXML = function(xml){

    var sig = new SignedXml();
    sig.signingKey = fs.readFileSync("templates/sig.key.pem");
    sig.addReference("//*[local-name(.)='Auth']", ["http://www.w3.org/2000/09/xmldsig#enveloped-signature"], "http://www.w3.org/2000/09/xmldsig#sha1", "", "", "", true)
    sig.keyInfoProvider = new AadhaarKeyInfo();

    sig.computeSignature(xml);

    return sig.getSignedXml();
};