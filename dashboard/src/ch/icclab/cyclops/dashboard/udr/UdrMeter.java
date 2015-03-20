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

package ch.icclab.cyclops.dashboard.udr;

import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.io.IOException;

/**
 * This class handles all requests associated with UDR meters. The class can load existing meter configuration and
 * update meter configuration on the UDR microservice
 */
public class UdrMeter extends ServerResource {

    /**
     * This method updates the meter configuration from the UDR microservice
     * <p>
     * The method receives the prepared request body from the dashboard frontend and sends it to the UDR Endpoint
     * configured in /WEB-INF/configuration.txt as UDR_METER_URL
     *
     * @param   entity   The incoming request from the dashboard frontend
     * @return  A representation of the untouched response
     */
    @Post("json")
    public Representation updateUdrMeters(Representation entity) {
        ClientResource res = new ClientResource(LoadConfiguration.configuration.get("UDR_METER_URL"));
        JsonRepresentation rep;

        try {
            rep = new JsonRepresentation(entity);
            return res.post(rep);
        } catch (IOException e) {
            //TODO: error handling
        }

        return new StringRepresentation("error");
    }


    /**
     * This method requests the configured meters from the UDR microservice
     *
     * @return  A representation of the untouched response
     */
    @Get("json")
    public Representation getUdrMeters() {
        ClientResource res = new ClientResource(LoadConfiguration.configuration.get("UDR_METER_URL"));
        return res.get();
    }
}
