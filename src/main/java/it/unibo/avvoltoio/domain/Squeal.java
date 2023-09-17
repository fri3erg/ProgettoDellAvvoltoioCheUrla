package it.unibo.avvoltoio.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Squeal.
 */
@Document(collection = "squeal")
public class Squeal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("timestamp")
    private Long timestamp;

    @Field("body")
    private String body;

    @Field("img")
    private byte[] img;

    @Field("img_content_type")
    private String imgContentType;

    @Field("img_name")
    private String imgName;

    @Field("video_content_type")
    private String videoContentType;

    @Field("video_name")
    private String videoName;

    @Field("n_characters")
    private Integer nCharacters;

    @Field("squeal_id_response")
    private String squealIdResponse;

    @Field("refresh_time")
    private Integer refreshTime;

    @Field("destination")
    @JsonIgnoreProperties(value = { "squeal" }, allowSetters = true)
    private Set<SquealDestination> destinations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Squeal id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return this.userId;
    }

    public Squeal userId(String userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getTimestamp() {
        return this.timestamp;
    }

    public Squeal timestamp(Long timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getBody() {
        return this.body;
    }

    public Squeal body(String body) {
        this.setBody(body);
        return this;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public byte[] getImg() {
        return this.img;
    }

    public Squeal img(byte[] img) {
        this.setImg(img);
        return this;
    }

    public void setImg(byte[] img) {
        this.img = img;
    }

    public String getImgContentType() {
        return this.imgContentType;
    }

    public Squeal imgContentType(String imgContentType) {
        this.imgContentType = imgContentType;
        return this;
    }

    public void setImgContentType(String imgContentType) {
        this.imgContentType = imgContentType;
    }

    public String getImgName() {
        return this.imgName;
    }

    public Squeal imgName(String imgName) {
        this.setImgName(imgName);
        return this;
    }

    public void setImgName(String imgName) {
        this.imgName = imgName;
    }

    public String getVideoContentType() {
        return this.videoContentType;
    }

    public Squeal videoContentType(String videoContentType) {
        this.setVideoContentType(videoContentType);
        return this;
    }

    public void setVideoContentType(String videoContentType) {
        this.videoContentType = videoContentType;
    }

    public String getVideoName() {
        return this.videoName;
    }

    public Squeal videoName(String videoName) {
        this.setVideoName(videoName);
        return this;
    }

    public void setVideoName(String videoName) {
        this.videoName = videoName;
    }

    public Integer getnCharacters() {
        return this.nCharacters;
    }

    public Squeal nCharacters(Integer nCharacters) {
        this.setnCharacters(nCharacters);
        return this;
    }

    public void setnCharacters(Integer nCharacters) {
        this.nCharacters = nCharacters;
    }

    public String getSquealIdResponse() {
        return this.squealIdResponse;
    }

    public Squeal squealIdResponse(String squealIdResponse) {
        this.setSquealIdResponse(squealIdResponse);
        return this;
    }

    public void setSquealIdResponse(String squealIdResponse) {
        this.squealIdResponse = squealIdResponse;
    }

    public Integer getRefreshTime() {
        return this.refreshTime;
    }

    public Squeal refreshTime(Integer refreshTime) {
        this.setRefreshTime(refreshTime);
        return this;
    }

    public void setRefreshTime(Integer refreshTime) {
        this.refreshTime = refreshTime;
    }

    public Set<SquealDestination> getDestinations() {
        return this.destinations;
    }

    public void setDestinations(Set<SquealDestination> squealDestinations) {
        if (this.destinations != null) {
            this.destinations.forEach(i -> i.setSqueal(null));
        }
        if (squealDestinations != null) {
            squealDestinations.forEach(i -> i.setSqueal(this));
        }
        this.destinations = squealDestinations;
    }

    public Squeal destinations(Set<SquealDestination> squealDestinations) {
        this.setDestinations(squealDestinations);
        return this;
    }

    public Squeal addDestination(SquealDestination squealDestination) {
        this.destinations.add(squealDestination);
        return this;
    }

    public Squeal removeDestination(SquealDestination squealDestination) {
        this.destinations.remove(squealDestination);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Squeal)) {
            return false;
        }
        return id != null && id.equals(((Squeal) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Squeal{" +
            "id=" + getId() +
            ", userId='" + getUserId() + "'" +
            ", timestamp=" + getTimestamp() +
            ", body='" + getBody() + "'" +
            ", img='" + getImg() + "'" +
            ", imgContentType='" + getImgContentType() + "'" +
            ", imgName='" + getImgName() + "'" +
            ", videoContentType='" + getVideoContentType() + "'" +
            ", videoName='" + getVideoName() + "'" +
            ", nCharacters=" + getnCharacters() +
            ", squealIdResponse='" + getSquealIdResponse() + "'" +
            ", refreshTime=" + getRefreshTime() +
            "}";
    }
}
