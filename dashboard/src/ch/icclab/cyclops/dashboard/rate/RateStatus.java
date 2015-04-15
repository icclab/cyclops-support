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

package ch.icclab.cyclops.dashboard.rate;

import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.io.IOException;

public class RateStatus extends ServerResource {
    @Get("json")
    public Representation getRateStatus() {
        String query = getRequest().getResourceRef().getQuery();
        String url = LoadConfiguration.configuration.get("RC_RATE_STATUS_URL") + "?" + query;
        ClientResource clientResource = new ClientResource(url);
        return clientResource.get();
    }

    @Post("json")
    public Representation updateRateStatus(Representation entity) {
        ClientResource res = new ClientResource(LoadConfiguration.configuration.get("RC_RATE_URL"));
        JsonRepresentation rep;

        try {
            rep = new JsonRepresentation(entity);
            return res.post(rep);
        } catch (IOException e) {
            //TODO: error handling
        }

        return new StringRepresentation("error");
    }
}