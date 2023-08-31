package it.unibo.avvoltoio.web.rest.errors;

public class SquealException extends RuntimeException {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public SquealException() {}

    public SquealException(String message) {
        super(message);
    }

    public SquealException(Throwable cause) {
        super(cause);
    }

    public SquealException(String message, Throwable cause) {
        super(message, cause);
    }

    public SquealException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
