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

package ch.icclab.cyclops.dashboard.bills;

import ch.icclab.cyclops.dashboard.database.DatabaseHelper;
import ch.icclab.cyclops.dashboard.database.DatabaseInteractionException;
import ch.icclab.cyclops.dashboard.errorreporting.ErrorReporter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.restlet.data.Form;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.resource.Get;
import org.restlet.resource.ResourceException;
import org.restlet.resource.ServerResource;

import java.util.List;

public class BillInformation extends ServerResource {
    @Get
    public Representation getBills() throws Exception {
        Form query = getRequest().getResourceRef().getQueryAsForm();
        String userId = query.getFirstValue("user_id", "");
        JSONArray jsonBills = new JSONArray();
        JsonRepresentation result = new JsonRepresentation(jsonBills);

        DatabaseHelper dbHelper = new DatabaseHelper();
        try {
            List<Bill> bills = dbHelper.getBillsForUser(userId);

            for(Bill bill : bills) {
                JSONObject billJson = new JSONObject();
                billJson.put("from", bill.getFromDate());
                billJson.put("to", bill.getToDate());
                jsonBills.put(billJson);
            }

            return result;

        }
        catch (DatabaseInteractionException e) {
            ErrorReporter.reportException(e);
            throw new ResourceException(404);
        }
        catch (Exception e) {
            ErrorReporter.reportException(e);
            throw e;
        }
    }
}
