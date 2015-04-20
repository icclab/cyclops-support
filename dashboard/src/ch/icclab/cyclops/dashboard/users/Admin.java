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

package ch.icclab.cyclops.dashboard.users;

import ch.icclab.cyclops.dashboard.errorreporting.ErrorReporter;
import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.restlet.data.ChallengeResponse;
import org.restlet.data.ChallengeScheme;
import org.restlet.data.Form;
import org.restlet.data.Header;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.Get;
import org.restlet.resource.Put;
import org.restlet.resource.ServerResource;
import org.restlet.util.Series;

import java.io.IOException;

/**
 * This class is responsible for requests to OpenAM that concern the administrator group
 */
public class Admin extends ServerResource{

    /**
     * This method updates gets information about the dashboard admin group from OpenAM
     * <p>
     * The method receives an OpenAM Session ID from the dashboard frontend and uses it to send a request to the OpenAM
     * endpoint configured in /WEB-INF/configuration.txt as OPENAM_LIST_ADMINS_URL
     * <p>
     * The call will only succeed if the given Session ID belongs to an admin user. Otherwise, an error message is
     * returned instead
     *
     * @return  A representation of the untouched response
     */
    @Get
    public Representation getAdminGroupInfo(){
        Form query = getRequest().getResourceRef().getQueryAsForm();
        String sessionId = query.getFirstValue("session_id", "");
        ClientResource clientResource = new ClientResource(LoadConfiguration.configuration.get("OPENAM_LIST_ADMINS_URL"));

        Series<Header> headers = (Series<Header>) clientResource.getRequestAttributes().get("org.restlet.http.headers");

        if (headers == null) {
            headers = new Series<Header>(Header.class);
            clientResource.getRequestAttributes().put("org.restlet.http.headers", headers);
        }

        headers.set("iPlanetDirectoryPro", sessionId);

        return clientResource.get();
    }

    @Put
    public Representation updateAdmins(Representation entity) {
        String sessionId = "";
        JSONArray admins;
        JSONObject updateObject = new JSONObject();

        try {
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject requestJson = represent.getJsonObject();
            JSONArray uniqueMembers = new JSONArray();
            admins = requestJson.getJSONArray("admins");
            sessionId = requestJson.getString("sessionId");

            String adminGroupName = LoadConfiguration.configuration.get("OPENAM_ADMIN_GROUP_NAME");
            String adminEntryPattern = LoadConfiguration.configuration.get("OPENAM_ADMIN_USER_PATTERN");

            updateObject.put("name", adminGroupName);
            updateObject.put("realm", "/");
            updateObject.put("cn", new JSONArray(new String[] { adminGroupName }));
            updateObject.put("description", "");

            for(int i = 0; i < admins.length(); i++) {
                String adminName = admins.getString(i);
                String uniqueMember = adminEntryPattern.replace("{{USERNAME}}", adminName);
                uniqueMembers.put(uniqueMember);
            }

            updateObject.put("uniquemember", uniqueMembers);

        } catch (JSONException e) {
            ErrorReporter.reportException(e);
        } catch (IOException e) {
            ErrorReporter.reportException(e);
        }

        String url = LoadConfiguration.configuration.get("OPENAM_LIST_ADMINS_URL");
        ClientResource clientResource = new ClientResource(url);

        Series<Header> headers = (Series<Header>) clientResource.getRequestAttributes().get("org.restlet.http.headers");

        if (headers == null) {
            headers = new Series<Header>(Header.class);
            clientResource.getRequestAttributes().put("org.restlet.http.headers", headers);
        }

        headers.set("iPlanetDirectoryPro", sessionId);
        return clientResource.put(updateObject);
    }
}