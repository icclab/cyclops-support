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

package ch.icclab.cyclops.dashboard.login;

import ch.icclab.cyclops.dashboard.errorreporting.ErrorReporter;
import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.json.JSONException;
import org.json.JSONObject;
import org.restlet.data.ChallengeScheme;
import org.restlet.data.Form;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.*;

import java.io.IOException;

/**
 * This class handles requests meant to request an access token from OpenAM and log into the dashboard
 */
public class Login extends ServerResource{

    /**
     * This method requests an Oauth / OpenID Connect access token from OpenAM
     * <p>
     * The method receives the user credentials from the dashboard frontend. Username and password are then used
     * to build a new request to the OpenAM endpoint configured in OAUTH_TOKEN_URL. The response will then be sent
     * to the frontend without modification.
     * <p>
     * Since the request requires an OAuth client username and password, these credentials need to be preconfigured
     * in /WEB-INF/configuration.txt as OAUTH_CLIENT_NAME and OAUTH_CLIENT_PASS.
     *
     * @param   entity   The incoming request from the dashboard frontend containing username and password
     * @return  A representation of the untouched response
     */
    @Post("json")
    public Representation login(Representation entity) {
        try {
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject json = represent.getJsonObject();
            String user = json.getString("username");
            String pass = json.getString("password");
            return sendRequest(user, pass);
        }
        catch (Exception e) {
            ErrorReporter.reportException(e);
            throw new ResourceException(500);
        }
    }

    private Representation sendRequest(String username, String password) {
        Form form = new Form();
        form.add("grant_type", "password");
        form.add("username", username);
        form.add("password", password);
        form.add("scope", LoadConfiguration.configuration.get("OAUTH_SCOPE"));
        ClientResource clientResource = new ClientResource(LoadConfiguration.configuration.get("OAUTH_TOKEN_URL"));
        clientResource.setChallengeResponse(
                ChallengeScheme.HTTP_BASIC,
                LoadConfiguration.configuration.get("OAUTH_CLIENT_NAME"),
                LoadConfiguration.configuration.get("OAUTH_CLIENT_PASS")
        );
        return clientResource.post(form);
    }
}
