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
    /**
     * This method returns the Keystone ID associated to an OpenStack account.
     * Username and password of the OpenStack account are provided via POST arguments.
     *
     * @param  entity Request entity
     * @return        The user's Keystone ID
     */
    @Post("json")
    public Representation getKeystoneUserId(Representation entity) {
        try {
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject requestJson = represent.getJsonObject();
            String username = requestJson.getString("username");
            String password = requestJson.getString("password");
            return sendRequest(username, password);
        }
        catch (Exception e) {
            ErrorReporter.reportException(e);
            throw new ResourceException(500);
        }
    }

    /**
     * This method stores a Keystone ID in a Field named "keystoneid" in OpenAM.
     * OpenAM needs to be properly configured for this to work.
     *
     * @param  entity Request Entity
     * @return        The untouched response from OpenAM
     */
    @Put("json")
    public Representation storeKeystoneUserId(Representation entity) {
        try {
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject requestJson = represent.getJsonObject();
            String username = requestJson.getString("username");
            String keystoneId = requestJson.getString("keystoneId");
            String sessionId = requestJson.getString("sessionId");

            ClientResource res = new ClientResource(LoadConfiguration.configuration.get("OPENAM_PROFILE_URL") + "/" + username);
            Series<Header> headers = (Series<Header>) res.getRequestAttributes().get("org.restlet.http.headers");

            if (headers == null) {
                headers = new Series<Header>(Header.class);
                res.getRequestAttributes().put("org.restlet.http.headers", headers);
            }

            headers.set("iPlanetDirectoryPro", sessionId);

            JSONObject data = new JSONObject();
            data.put("keystoneid", keystoneId);
            return res.put(new JsonRepresentation(data), MediaType.APPLICATION_JSON);
        }
        catch (Exception e) {
            ErrorReporter.reportException(e);
            throw new ResourceException(500);
        }
    }

    private Representation findUserId(Representation rep) throws JSONException, IOException {
        JSONObject response = new JSONObject();
        JsonRepresentation jsonRep = new JsonRepresentation(rep);
        JSONObject wrapper = jsonRep.getJsonObject();
        String id = wrapper
                .getJSONObject("token")
                .getJSONObject("user")
                .getString("id");

        response.put("keystoneId", id);
        return new JsonRepresentation(response);
    }

    private Representation sendRequest(String username, String pwd) throws JSONException, IOException {
        JsonRepresentation body = KeystoneRequestBuilder.buildKeystoneAuthRequestBody(username, pwd, "default");
        ClientResource clientResource = new ClientResource(LoadConfiguration.configuration.get("KEYSTONE_TOKEN_URL"));
        return findUserId(clientResource.post(body, MediaType.APPLICATION_JSON));
    }
}
