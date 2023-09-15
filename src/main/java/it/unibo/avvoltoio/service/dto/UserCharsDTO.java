package it.unibo.avvoltoio.service.dto;

public class UserCharsDTO {

    public enum Type {
        MONTH,
        WEEK,
        DAY,
    }

    private int remainingChars;
    private Type type;

    public int getRemainingChars() {
        return remainingChars;
    }

    public void setRemainingChars(int remainingChars) {
        this.remainingChars = remainingChars;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
}
