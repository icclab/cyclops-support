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
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.Post;
import org.restlet.resource.ResourceException;
import org.restlet.resource.ServerResource;

import java.util.ArrayList;
import java.util.List;

/**
 * This class handles the creation of new external meters
 */
public class ExternalMeterSources extends ServerResource {
    /**
     * This method adds a new external meter source to the database
     *
     * @param  entity Request Entity
     * @return        HTTP 200 or 500
     */
    @Post("json")
    public Representation addExternalMeterSource(Representation entity) {
        try {
            List<ExternalUserId> externalIds = new ArrayList<ExternalUserId>();
            JsonRepresentation represent = new JsonRepresentation(entity);

            JSONObject requestJson = represent.getJsonObject();
            String meterSource = requestJson.getString("source");

            DatabaseHelper dbHelper = new DatabaseHelper();
            dbHelper.addExternalMeterSource(meterSource);

            return new StringRepresentation("");
        }
        catch (Exception e) {
            ErrorReporter.reportException(e);
            throw new ResourceException(500);
        }
    }
}
