package it.unibo.avvoltoio.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A SMMUser.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SMMUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Field("user_id")
    private String userId;

    @DBRef
    @Field("sMM")
    @JsonIgnoreProperties(value = { "users" }, allowSetters = true)
    private SMMVIP sMM;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getUserId() {
        return this.userId;
    }

    public SMMUser userId(String userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public SMMVIP getSMM() {
        return this.sMM;
    }

    public void setSMM(SMMVIP sMMVIP) {
        this.sMM = sMMVIP;
    }

    public SMMUser sMM(SMMVIP sMMVIP) {
        this.setSMM(sMMVIP);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SMMUser)) {
            return false;
        }
        return false;
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SMMUser{" +
            ", userId='" + getUserId() + "'" +
            "}";
    }
}
