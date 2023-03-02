// served at https://chrt.com/.well-known/did.json
function handler(event) {
  var azure_did = {
    id: "did:web:chrt.com",
    "@context": [
      "https://www.w3.org/ns/did/v1",
      { "@base": "did:web:chrt.com" },
    ],
    service: [
      {
        id: "#linkeddomains",
        type: "LinkedDomains",
        serviceEndpoint: { origins: ["https://chrt.com/"] },
      },
      {
        id: "#hub",
        type: "IdentityHub",
        serviceEndpoint: {
          instances: [
            "https://hub.did.msidentity.com/v1.0/7ac809c4-1af4-4948-b3c6-07e1c1ec6b2e",
          ],
        },
      },
    ],
    verificationMethod: [
      {
        id: "#d091f0f60d0b4abab080b444d40b2ccfvcSigningKey-6fd7a",
        controller: "did:web:chrt.com",
        type: "EcdsaSecp256k1VerificationKey2019",
        publicKeyJwk: {
          crv: "secp256k1",
          kty: "EC",
          x: "EeakS0CC6mWSzPMOKr-PtQ8Jxw-4IVxRD36y1B2OLlE",
          y: "m4Iomewaz31g0BR317rfPMTCKzj-EP1KMSw1sevbozw",
        },
      },
    ],
    authentication: ["#d091f0f60d0b4abab080b444d40b2ccfvcSigningKey-6fd7a"],
    assertionMethod: ["#d091f0f60d0b4abab080b444d40b2ccfvcSigningKey-6fd7a"],
  };

  var response = {
    statusCode: 200,
    statusDescription: "OK",
    headers: {
      "cloudfront-functions": { value: "generated-by-CloudFront-Functions" },
    },
    body: JSON.stringify(azure_did),
  };
  return response;
}
