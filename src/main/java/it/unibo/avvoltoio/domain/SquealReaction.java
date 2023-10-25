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
    private String user_id;

    @Field("username")
    private String username;

    @Field("squeal_id")
    private String squeal_id;

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

    public String getUser_id() {
        return this.user_id;
    }

    public SquealReaction userId(String userId) {
        this.setUser_id(userId);
        return this;
    }

    public void setUser_id(String userId) {
        this.user_id = userId;
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

    public String getSqueal_id() {
        return this.squeal_id;
    }

    public SquealReaction squealId(String squealId) {
        this.setSqueal_id(squealId);
        return this;
    }

    public void setSqueal_id(String squealId) {
        this.squeal_id = squealId;
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
            ", userId='" + getUser_id() + "'" +
            ", username='" + getUsername() + "'" +
            ", squealId='" + getSqueal_id() + "'" +
            ", positive='" + getPositive() + "'" +
            ", emoji='" + getEmoji() + "'" +
            "}";
    }
}
