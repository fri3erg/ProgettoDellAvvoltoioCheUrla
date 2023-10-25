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

    @Field("seen")
    // 0 = false 1 = true
    private Integer seen;

    @Field("destination_type")
    private ChannelTypes destination_type;

    @Field("admin_add")
    private Boolean admin_add;

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

    public ChannelTypes getDestination_type() {
        return this.destination_type;
    }

    public SquealDestination destinationType(ChannelTypes destinationType) {
        this.setDestination_type(destinationType);
        return this;
    }

    public void setDestination_type(ChannelTypes destinationType) {
        this.destination_type = destinationType;
    }

    public Boolean getAdmin_add() {
        return this.admin_add;
    }

    public SquealDestination adminAdd(Boolean adminAdd) {
        this.setAdmin_add(adminAdd);
        return this;
    }

    public void setAdmin_add(Boolean adminAdd) {
        this.admin_add = adminAdd;
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

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

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
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
	@Override
	public String toString() {
		return "SquealDestination{" + ", destination='" + getDestination() + "'" + ", destinationType='"
				+ getDestination_type() + "'" + ", adminAdd='" + getAdmin_add() + "'" + "}";
	}

    public Integer getSeen() {
        return seen;
    }

    public void setSeen(Integer seen) {
        this.seen = seen;
    }

    public String getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(String destinationId) {
        this.destinationId = destinationId;
    }
}
