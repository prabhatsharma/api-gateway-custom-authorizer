'use strict';

var request = require("request");
var config = require("./config");
/**
 * Validates a google id_token
 * Documentation @ https://developers.google.com/identity/sign-in/web/backend-auth
 *{
 // These six fields are included in all Google ID Tokens.
 "iss": "https://accounts.google.com",
 "sub": "123456789123456789334",
 "azp": "1234567891231-dhdgwywtwuwuywuyeuweui454.apps.googleusercontent.com",
 "aud": "1234567891231-dhdgwywtwuwuywuyeuweui454.apps.googleusercontent.com",
 "iat": "1433978353",
 "exp": "1433981953",

 // These seven fields are only included when the user has granted the "profile" and
 // "email" OAuth scopes to the application.
 "email": "testuser@gmail.com",
 "email_verified": "true",
 "name" : "Test User",
 "picture": "https://lh4.googleusercontent.com/-kYgzyAWpZzJ/ABCDEFGHI/AAAJKLMNOP/tIXL9Ir44LE/s99-c/photo.jpg",
 "given_name": "Test",
 "family_name": "User",
 "locale": "en"
}
 * @return - invalid, success
 */
module.exports = function (id_token, callback) {
    var tokeninfoEndpoint = config.GOOGLE_TOKENINFO_URL;
    var clientId = config.GOOGLE_ID;

    request.get(tokeninfoEndpoint + id_token, function (error, response, body) {
        if (error) {
            callback(null, "error")
        } else {
            var b = JSON.parse(body);

            if (b.error_description) {
                callback(new Error(b.error_description));
            } else if (b.aud === clientId) { 
                callback(null, JSON.parse(body));
            } else {
                callback(new Error("Google returned unknown error"));
            }
        }
    });
}