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