# Using Authorization Code Flow with Proof Key for Code Exchange (PKCE) ("pixie")

## Authorization Code Flow without PKCE:

1. User authenticates
2. Authorization server sends an auth code to this SPA
3. SPA exchanges auth code for token(s)
4. Token(s) used as Bearer tokens when making requests to APIs serving protected resources

## PKCE prevents authorization code intercept attacks, as described below

- Auth0 SDK calculated a random `code_verifier` and its hash, named the `code_challenge`, at the start of each auth flow
- Auth0 SDK sends a request to the `/authorize` endpoint to begin authorization and includes the `code_challenge` (the hash of the `code_verifier`)
- Upon successful authentication, the user is redirected to this SPA with an `authorization_code`
  - This is where an auth code intercept attack could occur, in the absence of PKCE, due to:
    - insecure communication between authorization server and SPA
    - insecure device running the SPA
    - registration of a malicious application as a redirect target
- Auth0 SDK sends the `authorization_code` and the `code_verifier` to the `/oauth/token` endpoint
  - Before trading the auth code for token(s), the authorization server hashes the `code_verifier` to ensure that the hash matches the `code_challenge` this SPA sent earlier, thus verifying that the same SPA which started the flow is the one asking for token(s).
  - Thus, an auth code intercept is insufficient to gain access to token(s) and associated protected resources
  - Also, even if the malicious actor intercepted the `code_challenge`, they could not produce the appropriate `code_verifier` because they can't undo the hashing (random generation of the `code_verifier` value should prevent rainbow table attacks)
- The Auth0 backend verfiies the `authorization_code` and `code_verifier` and returns token(s)

# Code to hash `code_verifier` --> `code_challenge`

```js
// https://github.com/auth0/docs/blob/master/articles/api-auth/tutorials/authorization-code-grant-pkce.md

import crypto from "crypto";

function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

const code_verifier = "7Emjoid6QJroiQjs7~Ed7vxLXc354TEamXmdask1JgA";

const code_challenge = base64URLEncode(sha256(code_verifier));

//-- Testing values from example below in the markdown file --//
console.log("code_verifier: " + code_verifier); // 7Emjoid6QJroiQjs7~Ed7vxLXc354TEamXmdask1JgA
console.log("code_challenge: " + code_challenge); // edQF6TNyFfK5NofmJZDV33bIp_JsWJHsgtEIwWWWBjU
```

# EXAMPLE

1. Start login

- NOTE: the `code_challenge` is included in this request

```
https://chrt-prod.us.auth0.com/authorize
?client_id=8bDLHYeEUfPHH81VRDBsCTN5TYklAMCu
&scope=openid+read%3Ajournal+write%3Ajournal+read%3Adata
&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcallback
&audience=https%3A%2F%2Fchrt.com
&response_type=code
&response_mode=query
&state=VmlfSlJhSkNqSWU1bEEyUVM3eDYyVS55OWZXYmpBfnR4TUV3azByanVsVw%3D%3D
&nonce=SkoxaUk0Vmc2VUZtS343NzE5NmNuWXJkfnowSUx3U3IuVmpBb0lHLlBTOQ%3D%3D
&code_challenge=edQF6TNyFfK5NofmJZDV33bIp_JsWJHsgtEIwWWWBjU
&code_challenge_method=S256
&auth0Client=eyJuYW1lIjoiYXV0aDAtcmVhY3QiLCJ2ZXJzaW9uIjoiMi4wLjAifQ%3D%3D
```

```
https://chrt-prod.us.auth0.com/u/login
?state=hKFo2SAzNFk1YVhUT0ZlRlBES2k1VEZOSVVNSDRyc0p0ZFplRaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIDFmal84V09wRDV6cE1qc3BuRjJDMWo4aENGLTAyTTRGo2NpZNkgOGJETEhZZUVVZlBISDgxVlJEQnNDVE41VFlrbEFNQ3U
```

2. Redirected to Google to authenticate

```
https://accounts.google.com/o/oauth2/auth
?login_hint=
&response_type=code
&redirect_uri=https%3A%2F%2Fchrt-prod.us.auth0.com%2Flogin%2Fcallback
&scope=email%20profile
&state=-l66hbt2ic-VdDtEx-UmtMAg3hddAI8i
&client_id=386957909966-d4liodt9rfdc4t24htpetd0iduq4l939.apps.googleusercontent.com
```

```
https://chrt-prod.us.auth0.com/u/login
?state=hKFo2SAzNFk1YVhUT0ZlRlBES2k1VEZOSVVNSDRyc0p0ZFplRaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIDFmal84V09wRDV6cE1qc3BuRjJDMWo4aENGLTAyTTRGo2NpZNkgOGJETEhZZUVVZlBISDgxVlJEQnNDVE41VFlrbEFNQ3U
```

3. Upon successful authentication of Google account

```
https://accounts.google.com/signin/oauth/consent
?authuser=0
&part=AJi8hAOsnCGpmDkMyl3WUWyEDBnU29XjcfESoUJTOgox4LIxiXVmjL_re0OzqANqENvDOA6i_l0dUdUo_nLnZI_L26QjUYVLCtDdsTBxDbuMA9D5wine0OuGfheu260NOD1XQ5XP-cxLnc_gQhx1hfwyoz2Gbp-iX1BUut7ACgO7CjdPyLYGAoWZfVucvMeRR7KBSF03iPD0k2cdaRh8yEatvRcC4XNKpmUMyQm9oIttSQdKVeyAwigk8EsYtXLzR3Oul2M2qnm_wTmS6HCuEi935jmI3OvLoO-f_hMXtCmvGy5rS6l_4n8PPNqeERQncQ_ry0PdNQ_6mIWVRXtDxgMZjQXBMU4_C00F4J5bjWYBRsQK5_96pDJ5R9KS59FZ7qM8J-CuX-YR9w7UtTvXyO13NFCIfOtg4WAPwIG6Kb2TIt9QS9NZz2ofQySehqXAgKFP7rhxyOh-gmY2Ig7XdTsx5mNTdGKYYrIRDrojbeAJ4ojGzRyFRTM
&as=S-435949097%3A1675578403895731
&client_id=386957909966-d4liodt9rfdc4t24htpetd0iduq4l939.apps.googleusercontent.com
&pli=1
&rapt=AEjHL4NxSBaCNU-VTUf0Qn4f3wMWWCJ8-dsQN426du1tm0ghhO7RPY_F7C-lUpIxKDdo3aVSfPEeSYeXY_QBVPkadX7HOWbshg
```

```
https://chrt-prod.us.auth0.com/login/callback
?state=-l66hbt2ic-VdDtEx-UmtMAg3hddAI8i
&code=4%2F0AWtgzh611UjiZev9BUBCZGvE3gerVyQ7q9Ua0tPmwar6yvH6-F1zQz5iD-8ZGPQlWpFAmg
&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email
&authuser=0
&prompt=none
```

```
https://chrt-prod.us.auth0.com/authorize/resume
?state=1fj_8WOpD5zpMjspnF2C1j8hCF-02M4F
```

- NOTE: The `code` below is the `authorization_code`

```
http://localhost:5173/callback
?code=xAw8bFiDp5rkZlobxXE9bua-deN8Tm8SO5MP8_x9_AoZZ
&state=VmlfSlJhSkNqSWU1bEEyUVM3eDYyVS55OWZXYmpBfnR4TUV3azByanVsVw%3D%3D
```

4. Request token via `POST` request to `https://chrt-prod.us.auth0.com/oauth/token`

- NOTE: the `code_verifier` is included in this request
- NOTE: the `code` below is the `authorization_code` which was returned as a query param to the callback URL

```json
{
  "client_id": "8bDLHYeEUfPHH81VRDBsCTN5TYklAMCu",
  "code_verifier": "7Emjoid6QJroiQjs7~Ed7vxLXc354TEamXmdask1JgA",
  "grant_type": "authorization_code",
  "code": "xAw8bFiDp5rkZlobxXE9bua-deN8Tm8SO5MP8_x9_AoZZ",
  "redirect_uri": "http://localhost:5173/callback"
}
```

5. Receive token (both tokens are slightly scrambled to redact information)

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp6V2V3WGkyaV81WnpVSHpFZWwzRSJ9.23fv3MiOiJodHRwczovL2NocnQtcHJvZC51cy5hdXRoMvvC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwMTM3MjU1Mjg4MDMwNzIyOTY5NDIiLCJhdWQiOlsiaHR0cHM6Ly9jaHJ0LmNvbSIsImh0dHBzOi8vY2hydCav1wcm9kLnVzLmF1dGgfwasLdfmNvbS91c2VyaW5mbyJdvCJpYXQiOjE2NzU1Nzg1MDAsImV4cCI6MTY3NTY2NDkwMCw2iYXpwIjodiOGJETEhZZUVVZlBISDgxVlJEQnNDVE41VFlrbaEFNQ3UiLCJzY29wZSI6Im9wZWv5pZC3BycdZWFkvOmpvdXJuYWwgd3JpdGU6am91cm5hbCByZWFkOmdsaRhdGEiLCJwZXJtaXNzaW9ucyI6WyJyZWFkOm4RhdGEiLCJyZWFkOmpvdXJuYWwiLCJ3cml0ZTpqb53VybmFsIl19.bSLOYM_ripB7AjnUZhoIGParlUZhuK2U3mfo7CY5KtRlfzdn0qhep9sDF5XkksII72KfKzld7Wj30c2f6-fslBKNrv5KDd536XTR-Do3RfETmcY0XsOfrFO0z_RkJ1lCGFpvRt3CXBGcz10RB9ducRJcIMV6-JofZ2cl2U8xSTb0sg_BFmhMx-j8kCowfdoLJgp9w8bf0aJCtsyKMABGwwSU_PJpkuwUv089SeUiEAL5XY3tJyZC_drwQ-PeJ2eNi1lFk3pTmGPyYXnvCnEdDDEJwBwQstUrZIIjBPxVdUHt1XhW9K6Zx6PLGD9pG1WLszOvqIyMGeT_7VQGe_MnEAg",
  "expires_in": 86400,
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp6V2V3WGya81WnpVSHpFZWwzRSJ9.eyJpc3MiiJodwczovL2NocnQtcHJvZC51cy5hdXRoMC5jb20vIiwiYXVkIjoddiOGJEfTEhZZUVVZlBISDgxVlQnfNDVE41VFlrbFNQ3iLCJpYXQiOjE2NzU1NzgMDAsImV4cI6MTY3NTxNDUwgrMCwic3ViIjfoiZ2d9Z2xlLW9hdXRoMwxMTvM3MjU1Mjg4MDMwNzIyOTY5NIiLCJzaWQiOiJ2bFYMf3pZdXZiYWprTHfd1d0REvZDZEU3d6ZV90TFhuWCIsIm5vbamNlIjoiU2tveGFVazBWbWdMaavyVlVadFMzNDNOkU1Tm1OdVdYSmtmbm93U1V4M1UzSXVWbXBCYjBsSExsQlRPUT09In0.pMfyuwWOPzdpfr_04kT0suQEYzvnxbu7Gb8PRpVaT-oc1IqeyIbbb5poBRnrxZrbZDTkxLbVqGcACJHHclE_vcK40REWkN_OY1IxTRGnYmfGkI4bbgC4Q_PTSS4m8hje_CAOu_HHgTZrBNn7z7KfmmlnUPx89ej4PO7EHTGF4uNbHH0SXqcxz2S3ynC4ZS5Lc-fr-rkfDEYBd7lN76xCCh_CxVdLlG5c-I6wkRBuYi-M8hJkYgGp074pjLF7x667EH6ll1frbuhurokJLxUFQHqjOVTneKZ7VFHp5MJHJQl5cNGn0BxdjUKQvEcztcpz8CM9Rlq7EPcFh8JVSc2g",
  "scope": "openid read:journal write:journal read:data",
  "token_type": "Bearer"
}
```

### Decoded access_token

```json
{
  "iss": "https://chrt-prod.us.auth0.com/",
  "sub": "google-oauth2|*********************", //-- id redacted --//
  "aud": ["https://chrt.com", "https://chrt-prod.us.auth0.com/userinfo"],
  "iat": 1675578500,
  "exp": 1675664900,
  "azp": "8bDLHYeEUfPHH81VRDBsCTN5TYklAMCu",
  "scope": "openid read:journal write:journal read:data",
  "permissions": ["read:data", "read:journal", "write:journal"]
}
```

### Decoded id_token

```json
{
  "iss": "https://chrt-prod.us.auth0.com/",
  "aud": "8bDLHYeEUfPHH81VRDBsCTN5TYklAMCu",
  "iat": 1675578500,
  "exp": 1675614500,
  "sub": "google-oauth2|*********************", //-- id redacted --//
  "sid": "vmqX3zYuvbajkLwuwDDd6DSwze_tLXnX",
  "nonce": "SkoxaUk0Vmc2VUZtS343NzE5NmNuWXJkfnowSUx3U3IuVmpBb0lHLlBTOQ=="
}
```
