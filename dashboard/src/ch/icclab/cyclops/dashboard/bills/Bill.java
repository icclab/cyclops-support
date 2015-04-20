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

import java.util.HashMap;

public class Bill {
    private HashMap<String, String> info;
    private HashMap<String, Long> usagePerMeter;
    private HashMap<String, Double> ratePerMeter;
    private HashMap<String, String> unitPerMeter;
    private HashMap<String, Double> discounts;

    public Bill() {
        info = new HashMap<String, String>();
        usagePerMeter = new HashMap<String, Long>();
        ratePerMeter = new HashMap<String, Double>();
        unitPerMeter = new HashMap<String, String>();
        discounts = new HashMap<String, Double>();
        discounts.put("overall", 0.0);

        /*
            Debug
         */
        info.put("person-name", "Random Guy");
        info.put("org-name", "InIT Service Engineering");
        info.put("address-line1", "Obere Kirchgasse 2");
        info.put("address-line2", "CH Winterthur - 8401");
        info.put("bill-start-month", "December");
        info.put("bill-end-month", "December");
        info.put("bill-start-year", "2014");
        info.put("bill-end-year", "2014");
        info.put("period-start-date", "01");
        info.put("period-end-date", "31");
        info.put("payment-date", "15/01/2015");
    }

    public void addInfoField(String key, String value) {
        info.put(key, value);
    }

    public void addItem(String meterName, Long usage, Double rate, String unit) {
        usagePerMeter.put(meterName, usage);
        ratePerMeter.put(meterName, rate);
        unitPerMeter.put(meterName, unit);
    }

    public void addItem(String meterName, Long usage, Double rate, String unit, Double discount) {
        addItem(meterName, usage, rate, unit);
        discounts.put(meterName, discount);
    }

    public void addOverallDiscount(Double value) {
        discounts.put("overall", value);
    }

    public HashMap<String, String> getInfo() {
        return info;
    }

    public HashMap<String, Long> getUsage() {
        return usagePerMeter;
    }

    public HashMap<String, Double> getRates() {
        return ratePerMeter;
    }

    public HashMap<String, String> getUnits() {
        return unitPerMeter;
    }

    public HashMap<String, Double> getDiscounts() {
        return discounts;
    }
}
