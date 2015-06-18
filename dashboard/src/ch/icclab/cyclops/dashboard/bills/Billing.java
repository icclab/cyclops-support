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

import ch.icclab.cyclops.dashboard.oauth2.OAuthClientResource;
import ch.icclab.cyclops.dashboard.oauth2.OAuthServerResource;
import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.restlet.representation.Representation;
import org.restlet.resource.Get;

/**
 * This class handles / forwards the call concerning billing information to
 * the billing microservice
 */
public class Billing extends OAuthServerResource {
    /**
     * This method gets the billing details from the billing microservice.
     *
     * The method receives the the user's ID and two timestamps (from / to) from the dashboard frontend.
     * It then sends this information to the Billing Endpoint, requesting the billing data during the given time frame. The
     * Billing endpoint is configured in /WEB-INF/configuration.txt as BILLING_INVOICE_URL
     *
     * @return  A representation of the untouched response
     */
    @Get
    public Representation getBills() {
        String query = getRequest().getResourceRef().getQuery();
        String oauthToken = getOAuthTokenFromHeader();
        String url = LoadConfiguration.configuration.get("BILLING_INVOICE_URL") + "?" + query;
        OAuthClientResource clientResource = new OAuthClientResource(url, oauthToken);
        return clientResource.get();
    }
}
