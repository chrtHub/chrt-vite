// served at https://chrt.com/.well-known/did-configuration.json
function handler(event) {
  var azure_did_config = {
    "@context":
      "https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld",
    linked_dids: [
      "eyJhbGciOiJFUzI1NksiLCJraWQiOiJkaWQ6d2ViOmNocnQuY29tI2QwOTFmMGY2MGQwYjRhYmFiMDgwYjQ0NGQ0MGIyY2NmdmNTaWduaW5nS2V5LTZmZDdhIn0.eyJzdWIiOiJkaWQ6d2ViOmNocnQuY29tIiwiaXNzIjoiZGlkOndlYjpjaHJ0LmNvbSIsIm5iZiI6MTY3NDAxNDcwNiwiZXhwIjoyNDYyOTMzMTA2LCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vaWRlbnRpdHkuZm91bmRhdGlvbi8ud2VsbC1rbm93bi9jb250ZXh0cy9kaWQtY29uZmlndXJhdGlvbi12MC4wLmpzb25sZCJdLCJpc3N1ZXIiOiJkaWQ6d2ViOmNocnQuY29tIiwiaXNzdWFuY2VEYXRlIjoiMjAyMy0wMS0xOFQwNDowNTowNi40NTNaIiwiZXhwaXJhdGlvbkRhdGUiOiIyMDQ4LTAxLTE4VDA0OjA1OjA2LjQ1M1oiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRG9tYWluTGlua2FnZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6d2ViOmNocnQuY29tIiwib3JpZ2luIjoiaHR0cHM6Ly9jaHJ0LmNvbS8ifX19.sBzDMILx-RtedVPc6m1unrdVJm4G3MHnXRNXjNGPXUuGUiUkwCqKVpw6L5rGhR2RvBk1mwmlw_iasbh2TaPJ8w",
    ],
  };

  var response = {
    statusCode: 200,
    statusDescription: "OK",
    headers: {
      "cloudfront-functions": { value: "generated-by-CloudFront-Functions" },
    },
    body: JSON.stringify(azure_did_config),
  };
  return response;
}
