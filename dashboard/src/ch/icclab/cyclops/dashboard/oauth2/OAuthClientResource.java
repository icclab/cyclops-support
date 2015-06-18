package ch.icclab.cyclops.dashboard.oauth2;

import org.restlet.data.ChallengeResponse;
import org.restlet.data.ChallengeScheme;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;

/**
 * This class extends the RESTLET client resource by a method to add an OAUTH
 * header field for easier OAUTH handling.
 */
public class OAuthClientResource extends ClientResource {
    private String oauthToken;

    public OAuthClientResource(String url, String oauthToken) {
        super(url);
        this.oauthToken = oauthToken;
    }

    private void addTokenHeader() {
        ChallengeResponse challenge = new ChallengeResponse(ChallengeScheme.HTTP_OAUTH_BEARER);
        challenge.setRawValue(oauthToken);
        setChallengeResponse(challenge);
    }

    /**
     * This method adds the OAUTH header to the client resource before sending it.
     * Sending the request will be handled by the parent class.
     */
    @Override
    public Representation get() {
        addTokenHeader();
        return super.get();
    }

    /**
     * This method adds the OAUTH header to the client resource before sending it.
     * Sending the request will be handled by the parent class.
     */
    @Override
    public Representation post(Representation rep) {
        addTokenHeader();
        return super.post(rep);
    }
}
