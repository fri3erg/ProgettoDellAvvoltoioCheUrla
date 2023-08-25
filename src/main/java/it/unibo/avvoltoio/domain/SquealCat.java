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
    private String userId;

    @Field("squeal_id")
    private String squealId;

    @Field("category")
    private CategoryTypes category;

    @Field("n_characters")
    private Integer nCharacters;

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

    public String getUserId() {
        return this.userId;
    }

    public SquealCat userId(String userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSquealId() {
        return this.squealId;
    }

    public SquealCat squealId(String squealId) {
        this.setSquealId(squealId);
        return this;
    }

    public void setSquealId(String squealId) {
        this.squealId = squealId;
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

    public Integer getnCharacters() {
        return this.nCharacters;
    }

    public SquealCat nCharacters(Integer nCharacters) {
        this.setnCharacters(nCharacters);
        return this;
    }

    public void setnCharacters(Integer nCharacters) {
        this.nCharacters = nCharacters;
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
            ", userId='" + getUserId() + "'" +
            ", squealId='" + getSquealId() + "'" +
            ", category='" + getCategory() + "'" +
            ", nCharacters=" + getnCharacters() +
            ", timestamp=" + getTimestamp() +
            "}";
    }
}
