package it.unibo.avvoltoio.domain;

import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A UserChars.
 */
@Document(collection = "user_chars")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserChars implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("max_chars")
    private Integer maxChars;

    @Field("remaning_chars")
    private Integer remaningChars;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public UserChars id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return this.userId;
    }

    public UserChars userId(String userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getMaxChars() {
        return this.maxChars;
    }

    public UserChars maxChars(Integer maxChars) {
        this.setMaxChars(maxChars);
        return this;
    }

    public void setMaxChars(Integer maxChars) {
        this.maxChars = maxChars;
    }

    public Integer getRemaningChars() {
        return this.remaningChars;
    }

    public UserChars remaningChars(Integer remaningChars) {
        this.setRemaningChars(remaningChars);
        return this;
    }

    public void setRemaningChars(Integer remaningChars) {
        this.remaningChars = remaningChars;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserChars)) {
            return false;
        }
        return id != null && id.equals(((UserChars) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserChars{" +
            "id=" + getId() +
            ", userId='" + getUserId() + "'" +
            ", maxChars=" + getMaxChars() +
            ", remaningChars=" + getRemaningChars() +
            "}";
    }
}
