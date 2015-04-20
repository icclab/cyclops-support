/*
 * Copyright (c) 2015. Zuercher Hochschule fuer Angewandte Wissenschaften
 *  All Rights Reserved.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License"); you may
 *     not use this file except in compliance with the License. You may obtain
 *     a copy of the License at
 *
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *     WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *     License for the specific language governing permissions and limitations
 *     under the License.
 */

package ch.icclab.cyclops.dashboard.keystone;

import ch.icclab.cyclops.dashboard.builder.KeystoneRequestBuilder;
import ch.icclab.cyclops.dashboard.errorreporting.ErrorReporter;
import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.json.JSONException;
import org.json.JSONObject;
import org.restlet.data.Header;
import org.restlet.data.MediaType;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.resource.*;
import org.restlet.util.Series;

import java.io.IOException;

/**
 * This class handles all the requests necessary to associate a Keystone ID with an OpenAM profile
 */
public class KeystoneAssociation extends ServerResource{
    @Post("json")
    public Representation getKeystoneUserId(Representation entity) {
        /*
       Content-Type: application/json

       {
           "auth": {
               "identity": {
                   "methods": [
                       "password"
                   ],
                   "password": {
                       "user": {
                           "domain": {
                               "name": "default"
                           },
                           "name": "yyy",
                           "password": "xxx"
                       }
                   }
               }
           }
       }
        */
        String username = "";
        String password = "";

        try {
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject requestJson = represent.getJsonObject();
            username = requestJson.getString("username");
            password = requestJson.getString("password");
        } catch (JSONException e) {
            ErrorReporter.reportException(e);
        } catch (IOException e) {
            ErrorReporter.reportException(e);
        }

        return sendRequest(username, password);
    }

    @Get
    public Representation getKeystoneUserIdTest() {
        //For debugging, replace "user" and "pass"
        return sendRequest("user", "pass");
    }

    private Representation findUserId(Representation rep) {
        /*
        {
            "token":{
                "user":{
                    "domain":{  },
                    "id":"abc",
                    "name":"xyz"
                },
            }
        }
         */
        JSONObject response = new JSONObject();

        try {
            JsonRepresentation jsonRep = new JsonRepresentation(rep);
            JSONObject wrapper = jsonRep.getJsonObject();
            String id = wrapper
                    .getJSONObject("token")
                    .getJSONObject("user")
                    .getString("id");

            response.put("keystoneId", id);

        } catch (Exception e) {
            ErrorReporter.reportException(e);
        }

        return new JsonRepresentation(response);
    }

    private Representation sendRequest(String username, String pwd) {
        JsonRepresentation body = KeystoneRequestBuilder.buildKeystoneAuthRequestBody(username, pwd, "default");
        ClientResource clientResource = new ClientResource(LoadConfiguration.configuration.get("KEYSTONE_TOKEN_URL"));
        return findUserId(clientResource.post(body, MediaType.APPLICATION_JSON));
    }

    @Put("json")
    public Representation storeKeystoneUserId(Representation entity) {
        /*
        curl
            --request PUT
            --header "iplanetDirectoryPro: AQIC5wM2LY4Sfcyw6mmdgkdqMsFgwwViWRRdZtkz_lHA-wU.*AAJTSQACMDEAAlNLABMxNzAwMzU0MDA1NjY1MDY4MTEy*"
            --header "Content-Type: application/json"
            --data '{ "keystoneid": "2" }'
            http://public.example.com:8080/openam/json/users/trui3
         */
        String username = "";
        String keystoneId = "";
        String sessionId = "";

        try {
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject requestJson = represent.getJsonObject();
            username = requestJson.getString("username");
            keystoneId = requestJson.getString("keystoneId");
            sessionId = requestJson.getString("sessionId");
        } catch (JSONException e) {
            //TODO: error handling
        } catch (IOException e) {
            //TODO: error handling
        }

        ClientResource res = new ClientResource(LoadConfiguration.configuration.get("OPENAM_PROFILE_URL") + "/" + username);
        Series<Header> headers = (Series<Header>) res.getRequestAttributes().get("org.restlet.http.headers");

        if (headers == null) {
            headers = new Series<Header>(Header.class);
            res.getRequestAttributes().put("org.restlet.http.headers", headers);
        }

        headers.set("iPlanetDirectoryPro", sessionId);

        JSONObject data = new JSONObject();

        try {
            data.put("keystoneid", keystoneId);
        } catch (JSONException e) {
            ErrorReporter.reportException(e);
        }

        return res.put(new JsonRepresentation(data), MediaType.APPLICATION_JSON);
    }
}
