package ch.icclab.cyclops.dashboard.oauth2;

import org.restlet.data.Header;
import org.restlet.resource.ServerResource;
import org.restlet.util.Series;

public class OAuthServerResource extends ServerResource {
    public String getOAuthTokenFromHeader() {
        Series<Header> headers = (Series<Header>) getRequestAttributes().get("org.restlet.http.headers");

        if(headers == null) {
            return "";
        }

        return headers.getFirstValue("X-OAuth-Token", true, "");
    }
}
