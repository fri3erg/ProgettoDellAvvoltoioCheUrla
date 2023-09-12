package it.unibo.avvoltoio.service.dto;

import it.unibo.avvoltoio.domain.Squeal;
import it.unibo.avvoltoio.domain.SquealCat;
import it.unibo.avvoltoio.domain.SquealViews;
import java.util.List;

public class SquealDTO {

    private Squeal squeal;
    private SquealCat category;
    private List<ReactionDTO> reactions;
    private SquealViews views;
    private String userName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Squeal getSqueal() {
        return squeal;
    }

    public void setSqueal(Squeal squeal) {
        this.squeal = squeal;
    }

    public SquealCat getCategory() {
        return category;
    }

    public void setCategory(SquealCat category) {
        this.category = category;
    }

    public List<ReactionDTO> getReactions() {
        return reactions;
    }

    public void setReactions(List<ReactionDTO> reactions) {
        this.reactions = reactions;
    }

    public SquealViews getViews() {
        return views;
    }

    public void setViews(SquealViews views) {
        this.views = views;
    }
}
