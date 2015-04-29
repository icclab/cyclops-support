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
import org.restlet.data.Header;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;
import org.restlet.util.Series;

import java.io.IOException;

/**
 * This class is responsible for requests that handle OpenAM Sessions
 */
public class Session extends ServerResource{

    /**
     * This method requests an OpenAM session ID to later make OpenAM API calls
     * <p>
     * The method receives the user credentials from the dashboard frontend. Username and password are then used
     * to build a new request with X-OpenAM-Username and X-OpenAM-Password headers.
     * That request is then sent the appropriate OpenAM endpoint configured in OPENAM_AUTH_URL.
     * Finally, the response will then be sent to the frontend without modification.
     *
     * @param   entity   The incoming request from the dashboard frontend containing username and password
     * @return  A representation of the untouched response
     */
    @Post("json")
    public Representation login(Representation entity) throws Exception{
        try {
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject json = represent.getJsonObject();
            String user = json.getString("username");
            String pass = json.getString("password");
            return sendRequest(user, pass);
        }
        catch (Exception e) {
            ErrorReporter.reportException(e);
            throw e;
        }
    }

    private Representation sendRequest(String username, String password) {
        ClientResource res = new ClientResource(LoadConfiguration.configuration.get("OPENAM_AUTH_URL"));

        Series<Header> headers = (Series<Header>) res.getRequestAttributes().get("org.restlet.http.headers");

        if (headers == null) {
            headers = new Series<Header>(Header.class);
            res.getRequestAttributes().put("org.restlet.http.headers", headers);
        }

        headers.set("X-OpenAM-Username", username);
        headers.set("X-OpenAM-Password", password);
        return res.post(null);
    }
}
