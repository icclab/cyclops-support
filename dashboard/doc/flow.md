Communication Flow beween Dashboard and Microservice
===

The communication flow between the dashboard and microservices begins with the user logging into the dashboard. The user submits his credentials to the dashboard. (It is highly recommended to use SSL-protected connections to protect the user's password)

[images/dashboard_udr.jpg]

In step 2, the dashboard uses the credentials to request an access token from OpenAM, which will be returned if the credentials are valid (step 3). Using this access token, the dashboard can then request data from the UDR microservice, as seen in step 4. 

Before the UDR service returns any data, it needs to make sure that the user is authorised to make requests and access the requested data. To do this, it has to first validate the token with OpenAM (step 5 + 6). OpenAM answers with the token validity. Only if the token is valid will the UDR microservice send back the data to the dashboard.


Communication Flow beween different Microservices
===

[images/udr_rc.jpg]

When the RC Microservice asks for the usage data from the UDR Microservice, it has to send its access token with the request. The UDR Microservice will then ask OpenAM to validate the access token to make sure that nobody tries to impersonate the other microservice. If the access token is valid, the UDR Microservice returns the usage data back to the RC Microservice.

The preferred solution to provide microservices with an access token is using a long-term token (often referred to as API Key) that is associated with a microservice. The microservice would then use the same token for any of its requests to other microservices, which will validate it in the same way as before. It is important to know that these tokens should never leave the individual microservice. If an attacker could get his hands on such an API key, it would grant him long-term access until the token is invalidated, which is usually done manually and only if the administrator suspects abuse of the token.
