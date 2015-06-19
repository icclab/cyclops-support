package ch.icclab.cyclops.dashboard.oauth2;

import org.restlet.data.Header;
import org.restlet.resource.ServerResource;
import org.restlet.util.Series;

/**
 * This class extends the RESTLET server resource by a method to read the OAUTH
 * header field for easier OAUTH handling.
 */
public class OAuthServerResource extends ServerResource {

    /**
     * This method returns the OAUTH header if availabe
     * @return OAUTH token or empty string
     */
    public String getOAuthTokenFromHeader() {
        Series<Header> headers = (Series<Header>) getRequestAttributes().get("org.restlet.http.headers");

        if(headers == null) {
            return "";
        }

        return headers.getFirstValue("X-OAuth-Token", true, "");
    }
}
