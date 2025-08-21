## Testing Auth Protected Routes

### Getting an access token

Suppose, you've created a new user called `hello@example.com` and the password is `abc_123` and you want to generate an access token for this user so that you can test your server-side routes.

- In the Auth0 tenant for `Clinic Organiser`, go to general **Settings**, scroll down to **API Authorization Settings**, and set **Default Directory** to `Username-Password-Authentication`. 
- Go to the Applications section, "Settings", scroll al the way down to "Advanced Settings", "Grant Types" and tick the "Password" box. 

- Open Thunderclient and fill in the following information:

- URL: **POST** `https://clinic-organiser.au.auth0.com/oauth/token`
- **_For THUNDERCLIENT:_** Change the body to `Form-encode` and fill the following key/value pairs:

| key           | value                                           |
| ------------- | ----------------------------------------------- |
| audience      | https://clinic-organiser/api                    |
| grant_type    | password                                        |
| client_id     | <copy and paste it from the .env file>          |
| client_secret | <copy and paste it from the .env file>          |
| username      | email of an existing user (e.g `daph@example.com`) |
| password      | password for that user (e.g `Daphne1!`)  |


**NOTE**: access tokens expire after 24 hours, and you will need to generate a new token by using the same endpoint with the values from above.
It's a good idea to keep the HTTP request in Thunderclient because you'll need it for later.