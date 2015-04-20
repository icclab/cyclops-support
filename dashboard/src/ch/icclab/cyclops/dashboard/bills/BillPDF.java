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
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.io.IOException;
import java.util.Iterator;

public class BillPDF extends ServerResource {
    @Get
    public Representation createTestPDF() {
        Bill bill = new Bill();
        bill.addItem("cpu", 14261423871L, 0.0000000128, "ns", 5.00);
        bill.addItem("network.outgoing.bytes", 2261523811L, 0.0000012, "B", 8.00);
        bill.addItem("network.incoming.bytes", 2261811L, 0.000001, "B", 8.00);
        bill.addItem("disk.write.bytes", 17161811L, 0.000002, "B", 2.50);
        bill.addItem("disk.read.bytes", 917161811L, 0.000001, "B", 2.50);
        bill.addOverallDiscount(25.00);

        BillGenerator billGen = new BillGenerator();
        billGen.createPDF(bill);
        return new StringRepresentation("test bill created...");
    }

    @Post
    public Representation createPDF(Representation entity) {
        Bill bill = new Bill();

        try {
            JsonRepresentation represent = new JsonRepresentation(entity);
            JSONObject billDetails = represent.getJsonObject();

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

        } catch (JSONException e) {
            ErrorReporter.reportException(e);
        } catch (IOException e) {
            ErrorReporter.reportException(e);
        }

        BillGenerator billGen = new BillGenerator();
        billGen.createPDF(bill);

        return new StringRepresentation("bill created...");
    }
}
