package it.unibo.avvoltoio.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.unibo.avvoltoio.domain.enumeration.ChannelTypes;
import java.io.Serializable;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A SquealDestination.
 */
public class SquealDestination implements Serializable {

    private static final long serialVersionUID = 1L;

    @Field("destination")
    private String destination;

    @Field("destination_id")
    private String destinationId;

    public String getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(String destinationId) {
        this.destinationId = destinationId;
    }

    @Field("destination_type")
    private ChannelTypes destinationType;

    @Field("admin_add")
    private Boolean adminAdd;

    @DBRef
    @Field("squeal")
    @JsonIgnoreProperties(value = { "destinations" }, allowSetters = true)
    private Squeal squeal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getDestination() {
        return this.destination;
    }

    public SquealDestination destination(String destination) {
        this.setDestination(destination);
        return this;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public ChannelTypes getDestinationType() {
        return this.destinationType;
    }

    public SquealDestination destinationType(ChannelTypes destinationType) {
        this.setDestinationType(destinationType);
        return this;
    }

    public void setDestinationType(ChannelTypes destinationType) {
        this.destinationType = destinationType;
    }

    public Boolean getAdminAdd() {
        return this.adminAdd;
    }

    public SquealDestination adminAdd(Boolean adminAdd) {
        this.setAdminAdd(adminAdd);
        return this;
    }

    public void setAdminAdd(Boolean adminAdd) {
        this.adminAdd = adminAdd;
    }

    public Squeal getSqueal() {
        return this.squeal;
    }

    public void setSqueal(Squeal squeal) {
        this.squeal = squeal;
    }

    public SquealDestination squeal(Squeal squeal) {
        this.setSqueal(squeal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SquealDestination)) {
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
        return "SquealDestination{" +
            ", destination='" + getDestination() + "'" +
            ", destinationType='" + getDestinationType() + "'" +
            ", adminAdd='" + getAdminAdd() + "'" +
            "}";
    }
}
