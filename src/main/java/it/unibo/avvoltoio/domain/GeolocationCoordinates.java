package it.unibo.avvoltoio.domain;

import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A GeolocationCoordinates.
 */
@Document(collection = "geolocation_coordinates")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GeolocationCoordinates implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("squeal_id")
    private String squeal_id;

    @Field("user_id")
    private String user_id;

    @Field("latitude")
    private Double latitude;

    @Field("longitude")
    private Double longitude;

    @Field("accuracy")
    private Double accuracy;

    @Field("heading")
    private Double heading;

    @Field("speed")
    private Double speed;

    @Field("timestamp")
    private Long timestamp;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public GeolocationCoordinates id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSqueal_id() {
        return this.squeal_id;
    }

    public GeolocationCoordinates squealId(String squealId) {
        this.setSqueal_id(squealId);
        return this;
    }

    public void setSqueal_id(String squealId) {
        this.squeal_id = squealId;
    }

    public String getUser_id() {
        return this.user_id;
    }

    public GeolocationCoordinates userId(String userId) {
        this.setUser_id(userId);
        return this;
    }

    public void setUser_id(String userId) {
        this.user_id = userId;
    }

    public Double getLatitude() {
        return this.latitude;
    }

    public GeolocationCoordinates latitude(Double latitude) {
        this.setLatitude(latitude);
        return this;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return this.longitude;
    }

    public GeolocationCoordinates longitude(Double longitude) {
        this.setLongitude(longitude);
        return this;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getAccuracy() {
        return this.accuracy;
    }

    public GeolocationCoordinates accuracy(Double accuracy) {
        this.setAccuracy(accuracy);
        return this;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public Double getHeading() {
        return this.heading;
    }

    public GeolocationCoordinates heading(Double heading) {
        this.setHeading(heading);
        return this;
    }

    public void setHeading(Double heading) {
        this.heading = heading;
    }

    public Double getSpeed() {
        return this.speed;
    }

    public GeolocationCoordinates speed(Double speed) {
        this.setSpeed(speed);
        return this;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    public Long getTimestamp() {
        return this.timestamp;
    }

    public GeolocationCoordinates timestamp(Long timestamp) {
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
        if (!(o instanceof GeolocationCoordinates)) {
            return false;
        }
        return id != null && id.equals(((GeolocationCoordinates) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GeolocationCoordinates{" +
            "id=" + getId() +
            ", squealId='" + getSqueal_id() + "'" +
            ", userId='" + getUser_id() + "'" +
            ", latitude=" + getLatitude() +
            ", longitude=" + getLongitude() +
            ", accuracy=" + getAccuracy() +
            ", heading=" + getHeading() +
            ", speed=" + getSpeed() +
            ", timestamp=" + getTimestamp() +
            "}";
    }
}
