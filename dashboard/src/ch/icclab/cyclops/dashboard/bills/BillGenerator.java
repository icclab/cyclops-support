/**
 * Copyright 2014 Zuercher Hochschule fuer Angewandte Wissenschaften
 * All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * @description Simple PDF Generator library - using maven build framework
 * @author Piyush Harsh
 * @contact: piyush.harsh@zhaw.ch
 * @date 16.12.2014
 *
 *
 */

package ch.icclab.cyclops.dashboard.bills;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.edit.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.xobject.PDJpeg;
import org.apache.pdfbox.pdmodel.graphics.xobject.PDXObjectImage;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.HashMap;

public class BillGenerator {

    public void createPDF(String path, Bill bill) {
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        try {
            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            drawHeader(contentStream);
            drawFooter(document, contentStream, "/Users/harh/Desktop/logo.png");
            drawBillDetail(contentStream, bill.getInfo());
            drawItemizedDetail(contentStream, bill.getUsage(), bill.getRates(), bill.getUnits(), bill.getDiscounts());
            contentStream.close();
            document.save(path);
            document.close();
        } catch (Exception ex) {
            System.err.println("Exception caught!" + ex);
        }
    }

    /**
     * drawFooter.
     *
     * @param document      (required) reference to the PDFBox document object
     * @param contentStream (required) reference to the PDPageContentStream object.
     * @param logoFile      (required) full file path of the company's logo file
     */
    private void drawFooter(PDDocument document, PDPageContentStream contentStream, String logoFile) {
        //loading the logo image now
        BufferedImage img = null;
        try {
            img = ImageIO.read(new File(logoFile));
        } catch (IOException ex) {
            System.err.println("Exception caught: " + ex);
        }


        try {
            if (img != null) {
                PDXObjectImage ximage = new PDJpeg(document, img);
                contentStream.drawImage(ximage, 20, 20);
            }
            contentStream.drawLine(10, 80, 600, 80);
            contentStream.beginText();
            PDFont font = PDType1Font.TIMES_ROMAN;
            contentStream.setFont(font, 10);
            contentStream.moveTextPositionByAmount(75, 65);
            contentStream.drawString("The ICCLab cloud testbeds are provided, maintained as a public service to ZHAW research community. Please respect the model");
            contentStream.moveTextPositionByAmount(0, -10);
            contentStream.drawString("code of conduct, and respect the resource needs of your fellow researchers and students. The consumption figures shown above");
            contentStream.moveTextPositionByAmount(0, -10);
            contentStream.drawString("are just for your information. The cloud services are free at this moment, but this may change without advance notice.");
            contentStream.moveTextPositionByAmount(0, -22);
            contentStream.drawString("(c) 2013-2015 InIT Cloud Computing Lab");
            contentStream.endText();
        } catch (IOException ex) {
            System.err.println("Exception caught: " + ex);
        }
    }

    /**
     * drawHeader.
     *
     * @param contentStream (required) reference to the PDPageContentStream object.
     */
    private void drawHeader(PDPageContentStream contentStream) {
        PDFont font = PDType1Font.HELVETICA_BOLD;
        try {
            contentStream.setFont(font, 16);
            contentStream.beginText();
            contentStream.moveTextPositionByAmount(140, 750);
            contentStream.drawString("ICCLab - Monthly Resource Usage Summary");
            contentStream.endText();
            contentStream.drawLine(10, 720, 600, 720);
        } catch (IOException ex) {
            System.err.println("Exception caught: " + ex);
        }
    }

    /**
     * drawBillDetail.
     *
     * @param contentStream (required) reference to the PDPageContentStream object.
     * @param info          (required) dictionary containing the customer details and billing period
     */
    private void drawBillDetail(PDPageContentStream contentStream, HashMap<String, String> info) {
        PDFont font = PDType1Font.TIMES_BOLD;

        try {
            contentStream.setFont(font, 12);
            contentStream.beginText();
            contentStream.moveTextPositionByAmount(350, 700);
            contentStream.drawString("Customer-Name");
            contentStream.moveTextPositionByAmount(100, 0);
            font = PDType1Font.TIMES_ITALIC;
            contentStream.setFont(font, 12);
            contentStream.drawString(info.get("person-name"));
            contentStream.endText();

            font = PDType1Font.TIMES_BOLD;
            contentStream.setFont(font, 12);
            contentStream.beginText();
            contentStream.moveTextPositionByAmount(350, 685);
            contentStream.drawString("Organization");
            contentStream.moveTextPositionByAmount(100, 0);
            font = PDType1Font.TIMES_ITALIC;
            contentStream.setFont(font, 12);
            contentStream.drawString(info.get("org-name"));
            contentStream.endText();

            font = PDType1Font.TIMES_BOLD;
            contentStream.setFont(font, 12);
            contentStream.beginText();
            contentStream.moveTextPositionByAmount(350, 670);
            contentStream.drawString("Billing Address");
            contentStream.moveTextPositionByAmount(100, 0);
            font = PDType1Font.TIMES_ITALIC;
            contentStream.setFont(font, 12);
            contentStream.drawString(info.get("address-line1"));
            contentStream.moveTextPositionByAmount(0, -12);
            contentStream.drawString(info.get("address-line2"));
            contentStream.endText();

            font = PDType1Font.TIMES_BOLD;
            contentStream.setFont(font, 12);
            contentStream.beginText();
            contentStream.moveTextPositionByAmount(20, 700);
            contentStream.drawString("Billing Period");
            contentStream.moveTextPositionByAmount(80, 0);
            font = PDType1Font.TIMES_ITALIC;
            contentStream.setFont(font, 12);
            contentStream.drawString(info.get("period-start-date") + "-" + info.get("bill-start-month") + "-" + info.get("bill-start-year") +
                    " to " + info.get("period-end-date") + "-" + info.get("bill-end-month") + "-" + info.get("bill-end-year"));
            contentStream.endText();

            font = PDType1Font.TIMES_BOLD;
            contentStream.setFont(font, 12);
            contentStream.beginText();
            contentStream.moveTextPositionByAmount(20, 685);
            contentStream.drawString("Due Date");
            contentStream.moveTextPositionByAmount(80, 0);
            font = PDType1Font.TIMES_ITALIC;
            contentStream.setFont(font, 12);
            contentStream.drawString(info.get("payment-date"));
            contentStream.endText();

            font = PDType1Font.TIMES_BOLD;
            contentStream.setFont(font, 14);
            contentStream.beginText();
            contentStream.moveTextPositionByAmount(20, 600);
            contentStream.drawString("Itemized Consumption Summary");
            contentStream.endText();
        } catch (IOException ex) {
            System.err.println("Exception caught: " + ex);
        }
    }

    /**
     * drawFooter.
     *
     * @param contentStream (required) reference to the PDPageContentStream object.
     * @param usage         (required) dictionary containing the various meter usage values
     * @param rate          (required) dictionary containing the rates for the corresponding meters in usage dictionary, all meters entry must be present
     * @param unit          (required) dictionary containing the unit symbol for the corresponding meters in usage dictionary, all meters entry must be present
     * @param discount      (required) dictionary containing the individual volume based discount for the corresponding meters in usage dictionary, all meters entry must be present
     */
    private void drawItemizedDetail(PDPageContentStream contentStream, HashMap<String, Long> usage, HashMap<String, Double> rate, HashMap<String, String> unit, HashMap<String, Double> discount) {
        PDFont font;
        try {
            //printing the table header row
            contentStream.drawLine(40, 560, 550, 560);
            font = PDType1Font.TIMES_BOLD;
            contentStream.setFont(font, 12);
            contentStream.beginText();
            contentStream.moveTextPositionByAmount(50, 550);
            contentStream.drawString("Resource Name");
            font = PDType1Font.TIMES_BOLD;
            contentStream.setFont(font, 12);
            contentStream.moveTextPositionByAmount(150, 0);
            contentStream.drawString("Usage Value");
            font = PDType1Font.TIMES_BOLD;
            contentStream.setFont(font, 12);
            contentStream.moveTextPositionByAmount(100, 0);
            contentStream.drawString("Unit");
            font = PDType1Font.TIMES_BOLD;
            contentStream.setFont(font, 12);
            contentStream.moveTextPositionByAmount(50, 0);
            contentStream.drawString("Resource Rate");
            font = PDType1Font.TIMES_BOLD;
            contentStream.setFont(font, 12);
            contentStream.moveTextPositionByAmount(120, 0);
            contentStream.drawString("Usage Cost");
            contentStream.endText();
            contentStream.drawLine(40, 545, 550, 545);

            HashMap<String, Double> itemCost = new HashMap<String, Double>();

            //now printing the itemized values in row
            int rowIndex = 1;
            double totalCost = 0.0;
            for (String key : usage.keySet()) {
                font = PDType1Font.COURIER_BOLD;
                contentStream.setFont(font, 12);
                contentStream.beginText();
                contentStream.moveTextPositionByAmount(50, 550 - (rowIndex * 15));
                contentStream.drawString(ellipsis(key, 19));
                font = PDType1Font.COURIER_OBLIQUE;
                contentStream.setFont(font, 12);
                contentStream.moveTextPositionByAmount(150, 0);
                contentStream.drawString(Long.toString(usage.get(key)));
                font = PDType1Font.COURIER;
                contentStream.setFont(font, 12);
                contentStream.moveTextPositionByAmount(100, 0);
                contentStream.drawString(unit.get(key));
                font = PDType1Font.COURIER_BOLD;
                contentStream.setFont(font, 12);
                contentStream.moveTextPositionByAmount(50, 0);
                contentStream.drawString(toScientificNotation(rate.get(key)));
                double cost = Math.round(usage.get(key) * rate.get(key) * 100.0) / 100.0; // rounds to 2 decimal places
                itemCost.put(key, cost);
                totalCost += cost;
                font = PDType1Font.COURIER_BOLD_OBLIQUE;
                contentStream.setFont(font, 12);
                contentStream.moveTextPositionByAmount(120, 0);
                contentStream.drawString(Double.toString(cost));
                contentStream.endText();
                rowIndex++;
            }

            //Round to 2 decimal places
            totalCost = (Math.round(totalCost * 100) / 100);

            contentStream.drawLine(40, 550 - (rowIndex * 15), 550, 550 - (rowIndex * 15));
            contentStream.drawLine(40, 560, 40, 550 - (rowIndex * 15));
            contentStream.drawLine(550, 560, 550, 550 - (rowIndex * 15));

            font = PDType1Font.TIMES_BOLD;
            contentStream.setFont(font, 12);
            contentStream.beginText();
            contentStream.moveTextPositionByAmount(280, 500 - (rowIndex * 15));
            contentStream.drawString("Total Amount Due:");
            font = PDType1Font.TIMES_ITALIC;
            contentStream.setFont(font, 12);
            contentStream.moveTextPositionByAmount(200, 0);
            contentStream.drawString(totalCost + " CHF");
            int itemIndex = 1;
            double discountedTotalCost = 0.0;
            for (String key : discount.keySet()) {
                if (itemIndex == 1)
                    contentStream.moveTextPositionByAmount(-200, -20);
                else
                    contentStream.moveTextPositionByAmount(-200, -15);
                Double itemDiscount = discount.get(key);
                font = PDType1Font.TIMES_BOLD;
                contentStream.setFont(font, 12);
                contentStream.drawString(key + " discount: ");
                contentStream.moveTextPositionByAmount(200, 0);
                font = PDType1Font.TIMES_ITALIC;
                contentStream.setFont(font, 12);
                contentStream.drawString(itemDiscount.toString() + " %");
                //applying the discount to individual costs
                Double usageCost = itemCost.get(key);
                if (!key.startsWith("overall")) {
                    double discountedCost =
                            Math.round(usageCost * ((100.00 - itemDiscount) / 100.00) * 100.0) / 100.0;
                    discountedTotalCost += discountedCost;
                    //System.out.println(key + ", usage-cost: " + usageCost.doubleValue() + ", discount: " + itemDiscount.doubleValue() + ", discounted-price: " + discountedCost);
                }

                itemIndex++;
            }
            //now apply the final overall discount on top
            Double itemDiscount = discount.get("overall");
            discountedTotalCost =
                    Math.round(discountedTotalCost * ((100.00 - itemDiscount) / 100.00) * 100.0) / 100.0;

            contentStream.endText();
            contentStream.drawLine(270, 500 - ((rowIndex + itemIndex) * 15), 560, 500 - ((rowIndex + itemIndex) * 15));
            font = PDType1Font.COURIER_BOLD;
            contentStream.setFont(font, 14);
            contentStream.beginText();
            contentStream.moveTextPositionByAmount(280, 500 - ((rowIndex + itemIndex + 1) * 15));
            contentStream.setNonStrokingColor(Color.orange);
            contentStream.drawString("Grand Amount Due:");
            contentStream.moveTextPositionByAmount(200, 0);
            contentStream.drawString(discountedTotalCost + " CHF");
            contentStream.endText();
        } catch (IOException ex) {
            System.err.println("Exception caught: " + ex);
        }
    }

    private <T> String toScientificNotation(T d) {
        NumberFormat formatter = new DecimalFormat("0.##E0");
        return formatter.format(d);
    }

    private String ellipsis(String s, int maxLength) {
        if(s == null) {
            return null;
        }

        if(s.length() < maxLength) {
            return s;
        }

        return s.substring(0, maxLength - 3) + "...";
    }
}
