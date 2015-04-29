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

package ch.icclab.cyclops.dashboard.token;

import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.restlet.data.Form;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;

/**
 * This class provides access to the OpenAM UserInfo endpoint
 */
public class TokenInfo extends ServerResource{

    /**
     * This method requests Token information from OpenAM.
     * <p>
     * The method receives an access token from the dashboard frontend. With this token, a request is sent to the
     * appropriate OpenAM endpoint configured as OAUTH_TOKEN_INFO_URL. The response is then sent back to the dashboard.
     *
     * @return  A representation of the untouched response
     */
    @Get
    public Representation userinfo(){
        Form query = getRequest().getResourceRef().getQueryAsForm();
        String queryString = "?access_token=" + query.getFirstValue("access_token", "");
        ClientResource clientResource = new ClientResource(LoadConfiguration.configuration.get("OAUTH_TOKEN_INFO_URL") + queryString);
        return clientResource.get();
    }
}
