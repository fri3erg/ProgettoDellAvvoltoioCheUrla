package it.unibo.avvoltoio.domain;

import it.unibo.avvoltoio.domain.enumeration.ChannelTypes;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Channel.
 */
@Document(collection = "channel")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Channel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("name")
    private String name;

    @Field("type")
    private ChannelTypes type;

    @Field("mod_type")
    private String mod_type;

    @Field("emergency")
    private Boolean emergency;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Channel id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Channel name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ChannelTypes getType() {
        return this.type;
    }

    public Channel type(ChannelTypes type) {
        this.setType(type);
        return this;
    }

    public void setType(ChannelTypes type) {
        this.type = type;
    }

    public String getMod_type() {
        return this.mod_type;
    }

    public Channel modType(String modType) {
        this.setMod_type(modType);
        return this;
    }

    public void setMod_type(String modType) {
        this.mod_type = modType;
    }

    public Boolean getEmergency() {
        return this.emergency;
    }

    public Channel emergency(Boolean emergency) {
        this.setEmergency(emergency);
        return this;
    }

    public void setEmergency(Boolean emergency) {
        this.emergency = emergency;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Channel)) {
            return false;
        }
        return id != null && id.equals(((Channel) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Channel{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", modType='" + getMod_type() + "'" +
            ", emergency='" + getEmergency() + "'" +
            "}";
    }
}
