package it.unibo.avvoltoio.domain;

import it.unibo.avvoltoio.domain.enumeration.CategoryTypes;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A SquealCat.
 */
@Document(collection = "squeal_cat")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SquealCat implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("user_id")
    private String user_id;

    @Field("squeal_id")
    private String squeal_id;

    @Field("category")
    private CategoryTypes category;

    @Field("n_characters")
    private Integer n_characters;

    @Field("timestamp")
    private Long timestamp;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public SquealCat id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUser_id() {
        return this.user_id;
    }

    public SquealCat userId(String userId) {
        this.setUser_id(userId);
        return this;
    }

    public void setUser_id(String userId) {
        this.user_id = userId;
    }

    public String getSqueal_id() {
        return this.squeal_id;
    }

    public SquealCat squealId(String squealId) {
        this.setSqueal_id(squealId);
        return this;
    }

    public void setSqueal_id(String squealId) {
        this.squeal_id = squealId;
    }

    public CategoryTypes getCategory() {
        return this.category;
    }

    public SquealCat category(CategoryTypes category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(CategoryTypes category) {
        this.category = category;
    }

    public Integer getN_characters() {
        return this.n_characters;
    }

    public SquealCat nCharacters(Integer nCharacters) {
        this.setN_characters(nCharacters);
        return this;
    }

    public void setN_characters(Integer nCharacters) {
        this.n_characters = nCharacters;
    }

    public Long getTimestamp() {
        return this.timestamp;
    }

    public SquealCat timestamp(Long timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SquealCat)) {
            return false;
        }
        return id != null && id.equals(((SquealCat) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SquealCat{" +
            "id=" + getId() +
            ", userId='" + getUser_id() + "'" +
            ", squealId='" + getSqueal_id() + "'" +
            ", category='" + getCategory() + "'" +
            ", nCharacters=" + getN_characters() +
            ", timestamp=" + getTimestamp() +
            "}";
    }
}
