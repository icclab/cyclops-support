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
import org.json.JSONObject;
import org.restlet.data.Form;
import org.restlet.data.MediaType;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.FileRepresentation;
import org.restlet.representation.Representation;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ResourceException;
import org.restlet.resource.ServerResource;
import java.io.File;
import java.util.Iterator;
import java.util.UUID;

/**
 * This class handles all the REST calls concerning bill PDFs. These include
 * returning a PDF of an existing bill and creating new bills.
 */
public class BillPDF extends ServerResource {
    /**
     * This method returns a Bill PDF if there is any.
     *
     * The method receives the the user's ID and two timestamps (from / to) from the dashboard frontend.
     * The method then checks if there is a bill for the given user and the chosen time window. If there is,
     * it will return the PDF.
     *
     * @return  A file representation of the PDF
     */
    @Get
    public Representation getBillPDF() {
        try {
            DatabaseHelper dbHelper = new DatabaseHelper();
            Form query = getRequest().getResourceRef().getQueryAsForm();
            Bill bill = new Bill();

            String userId = query.getFirstValue("user_id", "");
            String from = query.getFirstValue("from", "");
            String to = query.getFirstValue("to", "");

            bill.setFromDate(from);
            bill.setToDate(to);

            String dbPdfPath = dbHelper.getBillPath(userId, bill);
            return new FileRepresentation(new File(dbPdfPath), MediaType.APPLICATION_PDF, 0);
        }
        catch(DatabaseInteractionException e) {
            ErrorReporter.reportException(e);
            throw new ResourceException(404);
        }
        catch(Exception e) {
            ErrorReporter.reportException(e);
            throw new ResourceException(500);
        }
    }

    /**
     * This method creates a PDF file if it does not yet exist. All the needed
     * data is provided through POST parameters
     *
     * @param  entity Request entity
     * @return A file representation of the PDF
     */
    @Post("json")
    public Representation createPDF(Representation entity) {
        try {
            Bill bill = new Bill();
            DatabaseHelper dbHelper = new DatabaseHelper();
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject billJson = represent.getJsonObject();
            String userId = billJson.getString("userId");
            String from = billJson.getString("from");
            String to = billJson.getString("to");
            String due = billJson.getString("due");
            String firstName = billJson.getString("firstName");
            String lastName = billJson.getString("lastName");
            JSONObject billDetails = billJson.getJSONObject("billItems");

            bill.setFromDate(from);
            bill.setToDate(to);
            bill.setDueDate(due);
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

                String logoPath = LoadConfiguration.configuration.get("WEB-INF") + "/images/icclab-logo-small.png";
                File logoFile = new File(logoPath);

                BillGenerator billGen = new BillGenerator();
                billGen.createPDF(path, bill, logoFile);
                dbHelper.addBill(userId, path, bill);
                return new FileRepresentation(pdfFile, MediaType.APPLICATION_PDF, 0);
            }
            else {
                String dbPdfPath = dbHelper.getBillPath(userId, bill);
                return new FileRepresentation(new File(dbPdfPath), MediaType.APPLICATION_PDF, 0);
            }
        }
        catch (DatabaseInteractionException e) {
            ErrorReporter.reportException(e);
            throw new ResourceException(404);
        }
        catch (Exception e) {
            ErrorReporter.reportException(e);
            throw new ResourceException(500);
        }
    }
}
