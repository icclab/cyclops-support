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
import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.json.JSONException;
import org.json.JSONObject;
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
import java.util.UUID;

public class BillPDF extends ServerResource {
    @Get
    public Representation getBillPDF() {
        return null;
    }

    @Post
    public Representation createPDF(Representation entity) {
        Bill bill = new Bill();
        DatabaseHelper dbHelper = new DatabaseHelper();

        try {
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject billJson = represent.getJsonObject();
            String userId = billJson.getString("userId");
            String from = billJson.getString("from");
            String to = billJson.getString("to");
            String firstName = billJson.getString("firstName");
            String lastName = billJson.getString("lastName");
            JSONObject billDetails = billJson.getJSONObject("billItems");

            bill.setFromDate(from);
            bill.setToDate(to);
            bill.setRecipientName(firstName, lastName);

            //If PDF doesn't exist yet, create it
            if(!dbHelper.existsBill(userId, bill)) {
                System.out.println("Bill does not exist yet");
                String basePath = LoadConfiguration.configuration.get("BILLING_PDF_PATH");
                String filename = UUID.randomUUID() + ".pdf";
                String path = basePath + "/" + filename;
                File pdfFile = new File(path);

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
                billGen.createPDF(path, bill);
                dbHelper.addBill(userId, path, bill);
                return new FileRepresentation(pdfFile, MediaType.APPLICATION_PDF, 0);
            }
            else {
                String dbPdfPath = dbHelper.getBillPath(userId, bill);
                return new FileRepresentation(new File(dbPdfPath), MediaType.APPLICATION_PDF, 0);
            }

        } catch (JSONException e) {
            ErrorReporter.reportException(e);
        } catch (IOException e) {
            ErrorReporter.reportException(e);
        } catch (DatabaseInteractionException e) {
            ErrorReporter.reportException(e);
        }

        return null;
    }
}
