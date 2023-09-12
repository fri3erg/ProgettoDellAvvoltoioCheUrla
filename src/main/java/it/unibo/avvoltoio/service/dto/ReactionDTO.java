package it.unibo.avvoltoio.service.dto;

public class ReactionDTO {

    private String reaction;
    private int number;
    private boolean user;

    public ReactionDTO() {
        super();
    }

    public ReactionDTO(String reaction) {
        this.reaction = reaction;
    }

    public String getReaction() {
        return reaction;
    }

    public void setReaction(String reaction) {
        this.reaction = reaction;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public boolean isUser() {
        return user;
    }

    public void setUser(boolean user) {
        this.user = user;
    }
}
