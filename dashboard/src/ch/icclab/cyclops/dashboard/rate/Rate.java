package ch.icclab.cyclops.dashboard.rate;

import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;

public class Rate extends ServerResource {
    @Get("json")
    public Representation getRate() {
        String query = getRequest().getResourceRef().getQuery();
        String url = LoadConfiguration.configuration.get("RC_RATE_URL") + "?" + query;
        ClientResource clientResource = new ClientResource(url);
        return clientResource.get();
    }
}