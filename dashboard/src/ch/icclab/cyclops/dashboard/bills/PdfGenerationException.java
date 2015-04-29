package ch.icclab.cyclops.dashboard.bills;

public class PdfGenerationException extends Exception{
    public PdfGenerationException(String message) {
        super(message);
    }

    public PdfGenerationException(String message, Throwable throwable) {
        super(message, throwable);
    }
}

