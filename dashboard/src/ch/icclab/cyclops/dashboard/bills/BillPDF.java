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

import ch.icclab.cyclops.dashboard.errorreporting.ErrorReporter;
import org.json.JSONException;
import org.json.JSONObject;
import org.restlet.data.Form;
import org.restlet.data.MediaType;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.FileRepresentation;
import org.restlet.representation.Representation;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;

public class BillPDF extends ServerResource {
    @Get
    public Representation loadPDF() {
        //TODO: check identity to make sure the user only requests his own bills
        Form query = getRequest().getResourceRef().getQueryAsForm();
        String userId = query.getFirstValue("user_id", "");
        String fileName = "/Users/beni_std/Desktop/bills/" + removeSlashes(userId) + ".pdf";
        return new FileRepresentation(new File(fileName), MediaType.APPLICATION_PDF, 0);
    }

    @Post
    public void createPDF(Representation entity) {
        Bill bill = new Bill();

        try {
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject billJson = represent.getJsonObject();
            String userId = billJson.getString("userId");
            String from = billJson.getString("from");
            String to = billJson.getString("to");
            JSONObject billDetails = billJson.getJSONObject("items");

            Iterator<?> keys = billDetails.keys();

            while( keys.hasNext() ) {
                String key = (String) keys.next();
                JSONObject billItem = (JSONObject) billDetails.get(key);
                Long usage = billItem.getLong("usage");
                Double rate = billItem.getDouble("rate");
                String unit = billItem.getString("unit");
                Double discount = billItem.getDouble("discount");
                bill.addItem(key, usage, rate, unit, discount);
            }

            BillGenerator billGen = new BillGenerator();
            String path = "/Users/beni_std/Desktop/bills/" + removeSlashes(userId) + "_" + removeSlashes(from) + "_" + removeSlashes(to) + ".pdf";
            billGen.createPDF(path, bill);

        } catch (JSONException e) {
            ErrorReporter.reportException(e);
        } catch (IOException e) {
            ErrorReporter.reportException(e);
        }
    }

    private String removeSlashes(String input) {
        return input.replace("/", "").replace("\\", "");
    }
}
