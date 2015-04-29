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

package ch.icclab.cyclops.dashboard.keystone;

import ch.icclab.cyclops.dashboard.builder.KeystoneRequestBuilder;
import ch.icclab.cyclops.dashboard.errorreporting.ErrorReporter;
import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.json.JSONException;
import org.restlet.data.Header;
import org.restlet.data.MediaType;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;
import org.restlet.util.Series;

/**
 * This class handles all the requests handling keystone meters
 */
public class KeystoneMeter extends ServerResource{

    /**
     * This method loads all the meters from all the users from keystone.
     * <p>
     * Firstly, the method authenticates to Keystone using a predefined OpenStack user account. Credentials to the
     * account are stored in /WEB-INF/configuration.txt, accessible by KEYSTONE_CYCLOPS_USERNAME and
     * KEYSTONE_CYCLOPS_PASSWORD from the LoadConfiguration.
     * <p>
     * In a second step, the authentication token is used to request the list of meters from keystone. The result is then
     * returned to the caller.
     *
     * @return  A representation of the untouched response
     */
    @Get
    public Representation getKeystoneMeters() throws Exception {
        try {
            String authUrl = LoadConfiguration.configuration.get("KEYSTONE_TOKEN_URL");
            String meterUrl = LoadConfiguration.configuration.get("KEYSTONE_METERS_URL");// + "?q.field=user_id&q.value=x";

            JsonRepresentation authBody = KeystoneRequestBuilder.buildKeystoneAuthRequestBody(
                    LoadConfiguration.configuration.get("KEYSTONE_CYCLOPS_USERNAME"),
                    LoadConfiguration.configuration.get("KEYSTONE_CYCLOPS_PASSWORD"),
                    LoadConfiguration.configuration.get("KEYSTONE_CYCLOPS_DOMAIN")
            );

            ClientResource authResource = new ClientResource(authUrl);
            ClientResource meterResource = new ClientResource(meterUrl);
            authResource.post(authBody, MediaType.APPLICATION_JSON);
            Series<Header> responseHeaders =
                    (Series<Header>) authResource.getResponseAttributes().get("org.restlet.http.headers");
            String subjectToken = responseHeaders.getFirstValue("X-Subject-Token");

            Series<Header> requestHeaders =
                    (Series<Header>) meterResource.getRequestAttributes().get("org.restlet.http.headers");

            if (requestHeaders == null) {
                requestHeaders = new Series<Header>(Header.class);
                meterResource.getRequestAttributes().put("org.restlet.http.headers", requestHeaders);
            }

            requestHeaders.set("X-Auth-Token", subjectToken);

            return meterResource.get(MediaType.APPLICATION_JSON);

        }
        catch (Exception e) {
            ErrorReporter.reportException(e);
            throw e;
        }
    }
}
