package ch.icclab.cyclops.dashboard.oauth2;

import org.restlet.data.ChallengeResponse;
import org.restlet.data.ChallengeScheme;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;

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

    @Override
    public Representation get() {
        addTokenHeader();
        return super.get();
    }

    @Override
    public Representation post(Representation rep) {
        addTokenHeader();
        return super.post(rep);
    }
}
