package ch.icclab.cyclops.dashboard.database;

public class DatabaseInteractionException extends Exception{
    public DatabaseInteractionException(String message) {
        super(message);
    }

    public DatabaseInteractionException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
