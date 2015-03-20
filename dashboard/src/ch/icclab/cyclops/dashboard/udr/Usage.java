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

package ch.icclab.cyclops.dashboard.udr;

import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.json.JSONException;
import org.json.JSONObject;
import org.restlet.data.ChallengeResponse;
import org.restlet.data.ChallengeScheme;
import org.restlet.data.Form;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.io.IOException;

/**
 * This class handles all requests concerning the UDR microservice's usage data
 */
public class Usage extends ServerResource{

    /**
     * This method updates gets the usage data from the UDR microservice
     * <p>
     * The method receives the the user's keystone ID and two timestamps (from / to) from the dashboard frontend.
     * It then sends this information to the UDR Endpoint, requesting the usage data during the given time frame. The
     * UDR endpoint is configured in /WEB-INF/configuration.txt as UDR_USAGE_URL
     *
     * @param   entity   The incoming request from the dashboard frontend
     * @return  A representation of the untouched response
     */
    @Post("json")
    public Representation getUsageData(Representation entity) {
        String userId = "";
        String from = "";
        String to = "";

        try {
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject requestJson = represent.getJsonObject();
            userId = requestJson.getString("keystoneId");
            from = requestJson.getString("from");
            to = requestJson.getString("to");

        } catch (JSONException e) {
            //TODO: error handling
        } catch (IOException e) {
            //TODO: error handling
        }

        Form form = new Form();
        form.add("userid", userId);
        form.add("from", from);
        form.add("to", to);

        String url = LoadConfiguration.configuration.get("UDR_USAGE_URL") + "?" + form.getQueryString();
        ClientResource clientResource = new ClientResource(url);
        ChallengeScheme scheme = new ChallengeScheme("Bearer", "Bearer");
        //TODO: use real Token
        ChallengeResponse challenge = new ChallengeResponse(scheme, "Bearer", "test");
        clientResource.setChallengeResponse(challenge);
        return clientResource.get();
    }
}
