package ch.icclab.cyclops.dashboard.externalMeters;

public class ExternalUserId {
    private String source;
    private String userId;

    public ExternalUserId(String source, String userId) {
        setSource(source);
        setUserId(userId);
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        if(userId == null) {
            this.userId = "";
        }
        else {
            this.userId = userId;
        }
    }
}
