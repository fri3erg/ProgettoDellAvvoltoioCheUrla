package it.unibo.avvoltoio.domain;

import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A SquealReaction.
 */
@Document(collection = "squeal_reaction")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SquealReaction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("username")
    private String username;

    @Field("squeal_id")
    private String squealId;

    @Field("positive")
    private Boolean positive;

    @Field("emoji")
    private String emoji;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public SquealReaction id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return this.userId;
    }

    public SquealReaction userId(String userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return this.username;
    }

    public SquealReaction username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSquealId() {
        return this.squealId;
    }

    public SquealReaction squealId(String squealId) {
        this.setSquealId(squealId);
        return this;
    }

    public void setSquealId(String squealId) {
        this.squealId = squealId;
    }

    public Boolean getPositive() {
        return this.positive;
    }

    public SquealReaction positive(Boolean positive) {
        this.setPositive(positive);
        return this;
    }

    public void setPositive(Boolean positive) {
        this.positive = positive;
    }

    public String getEmoji() {
        return this.emoji;
    }

    public SquealReaction emoji(String emoji) {
        this.setEmoji(emoji);
        return this;
    }

    public void setEmoji(String emoji) {
        this.emoji = emoji;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SquealReaction)) {
            return false;
        }
        return id != null && id.equals(((SquealReaction) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SquealReaction{" +
            "id=" + getId() +
            ", userId='" + getUserId() + "'" +
            ", username='" + getUsername() + "'" +
            ", squealId='" + getSquealId() + "'" +
            ", positive='" + getPositive() + "'" +
            ", emoji='" + getEmoji() + "'" +
            "}";
    }
}
