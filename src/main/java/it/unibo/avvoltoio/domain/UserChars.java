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
    private String user_id;

    @Field("max_chars")
    private Integer max_chars;

    @Field("remaning_chars")
    private Integer remaning_chars;

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

    public String getUser_id() {
        return this.user_id;
    }

    public UserChars userId(String userId) {
        this.setUser_id(userId);
        return this;
    }

    public void setUser_id(String userId) {
        this.user_id = userId;
    }

    public Integer getMax_chars() {
        return this.max_chars;
    }

    public UserChars maxChars(Integer maxChars) {
        this.setMax_chars(maxChars);
        return this;
    }

    public void setMax_chars(Integer maxChars) {
        this.max_chars = maxChars;
    }

    public Integer getRemaning_chars() {
        return this.remaning_chars;
    }

    public UserChars remaningChars(Integer remaningChars) {
        this.setRemaning_chars(remaningChars);
        return this;
    }

    public void setRemaning_chars(Integer remaningChars) {
        this.remaning_chars = remaningChars;
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
            ", userId='" + getUser_id() + "'" +
            ", maxChars=" + getMax_chars() +
            ", remaningChars=" + getRemaning_chars() +
            "}";
    }
}
