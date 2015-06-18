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

package ch.icclab.cyclops.dashboard.externalMeters;

import ch.icclab.cyclops.dashboard.database.DatabaseHelper;
import ch.icclab.cyclops.dashboard.errorreporting.ErrorReporter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.restlet.data.Form;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ResourceException;
import org.restlet.resource.ServerResource;

import java.util.ArrayList;
import java.util.List;

/**
 * This class handles the association of external user IDs with external meters
 */
public class ExternalUserAccounts extends ServerResource {
    /**
     * This method returns all external IDs of a given user_id
     *
     * @param  entity Request entity
     * @return        All external IDs
     */
    @Get
    public Representation getExternalUserIds(Representation entity) {
        try {
            Form query = getRequest().getResourceRef().getQueryAsForm();
            String userId = query.getFirstValue("user_id", "");
            JSONArray response = new JSONArray();

            DatabaseHelper dbHelper = new DatabaseHelper();
            List<ExternalUserId> externalIds = dbHelper.getExternalUserIds(userId);

            for(ExternalUserId exId : externalIds) {
                JSONObject externalId = new JSONObject();
                externalId.put("source", exId.getSource());
                externalId.put("userId", exId.getUserId());
                response.put(externalId);
            }

            return new JsonRepresentation(response);
        }
        catch (Exception e) {
            ErrorReporter.reportException(e);
            throw new ResourceException(500);
        }
    }

    /**
     * This method updates external user IDs for a given user. If a new ID is given,
     * it will be added. If an existing ID is provided, it will be updated.
     *
     * @param  entity Request entity
     * @return        HTTP 200 or 500
     */
    @Post("json")
    public Representation updateExternalUserIds(Representation entity) {
        try {
            List<ExternalUserId> externalIds = new ArrayList<ExternalUserId>();
            JsonRepresentation represent = new JsonRepresentation(entity);

            JSONObject requestJson = represent.getJsonObject();
            String userId = requestJson.getString("userId");
            JSONArray externalIdsJson = requestJson.getJSONArray("externalIds");

            for(int i = 0; i < externalIdsJson.length(); i++) {
                JSONObject externalIdJson = externalIdsJson.getJSONObject(i);
                externalIds.add(new ExternalUserId(externalIdJson.getString("source"), externalIdJson.getString("userId")));
            }

            DatabaseHelper dbHelper = new DatabaseHelper();
            dbHelper.updateExternalUserIds(userId, externalIds);

            return new StringRepresentation("");
        }
        catch (Exception e) {
            ErrorReporter.reportException(e);
            throw new ResourceException(500);
        }
    }
}
