package it.unibo.avvoltoio.domain;

import it.unibo.avvoltoio.domain.enumeration.PrivilegeType;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A ChannelUser.
 */
@Document(collection = "channel_user")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ChannelUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("user_id")
    private String user_id;

    @Field("channel_id")
    private String channel_id;

    @Field("privilege")
    private PrivilegeType privilege;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public ChannelUser id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUser_id() {
        return this.user_id;
    }

    public ChannelUser userId(String userId) {
        this.setUser_id(userId);
        return this;
    }

    public void setUser_id(String userId) {
        this.user_id = userId;
    }

    public String getChannel_id() {
        return this.channel_id;
    }

    public ChannelUser channelId(String channelId) {
        this.setChannel_id(channelId);
        return this;
    }

    public void setChannel_id(String channelId) {
        this.channel_id = channelId;
    }

    public PrivilegeType getPrivilege() {
        return this.privilege;
    }

    public ChannelUser privilege(PrivilegeType privilege) {
        this.setPrivilege(privilege);
        return this;
    }

    public void setPrivilege(PrivilegeType privilege) {
        this.privilege = privilege;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChannelUser)) {
            return false;
        }
        return id != null && id.equals(((ChannelUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChannelUser{" +
            "id=" + getId() +
            ", userId='" + getUser_id() + "'" +
            ", channelId='" + getChannel_id() + "'" +
            ", privilege='" + getPrivilege() + "'" +
            "}";
    }
}
