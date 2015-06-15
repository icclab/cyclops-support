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

package ch.icclab.cyclops.dashboard.users;

import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.restlet.data.Form;
import org.restlet.data.Header;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;
import org.restlet.util.Series;

/**
 * This class provides access to OpenAM user information
 */
public class UserInfo extends ServerResource{

    @Get
    public Representation getUserInfo(){
        Form query = getRequest().getResourceRef().getQueryAsForm();
        String sessionId = query.getFirstValue("session_id", "");
        String user = getRequest().getAttributes().get("user").toString();
        String urlPattern = LoadConfiguration.configuration.get("OPENAM_LIST_USERINFO_URL");
        String url = urlPattern.replace("{{USERNAME}}", user);
        ClientResource clientResource = new ClientResource(url);

        Series<Header> headers = (Series<Header>) clientResource.getRequestAttributes().get("org.restlet.http.headers");

        if (headers == null) {
            headers = new Series<Header>(Header.class);
            clientResource.getRequestAttributes().put("org.restlet.http.headers", headers);
        }

        headers.set("iPlanetDirectoryPro", sessionId);

        return clientResource.get();
    }
}