package it.unibo.avvoltoio.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A SMMVIP.
 */
@Document(collection = "smmvip")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SMMVIP implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("users")
    @JsonIgnoreProperties(value = { "sMM" }, allowSetters = true)
    private Set<SMMUser> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public SMMVIP id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return this.userId;
    }

    public SMMVIP userId(String userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Set<SMMUser> getUsers() {
        return this.users;
    }

    public void setUsers(Set<SMMUser> sMMUsers) {
        if (this.users != null) {
            this.users.forEach(i -> i.setSMM(null));
        }
        if (sMMUsers != null) {
            sMMUsers.forEach(i -> i.setSMM(this));
        }
        this.users = sMMUsers;
    }

    public SMMVIP users(Set<SMMUser> sMMUsers) {
        this.setUsers(sMMUsers);
        return this;
    }

    public SMMVIP addUsers(SMMUser sMMUser) {
        this.users.add(sMMUser);
        return this;
    }

    public SMMVIP removeUsers(SMMUser sMMUser) {
        this.users.remove(sMMUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SMMVIP)) {
            return false;
        }
        return id != null && id.equals(((SMMVIP) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SMMVIP{" +
            "id=" + getId() +
            ", userId='" + getUserId() + "'" +
            "}";
    }
}
