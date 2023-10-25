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
    private String user_id;

    @Field("timestamp")
    private Long timestamp;

    @Field("body")
    private String body;

    @Field("img")
    private byte[] img;

    @Field("img_content_type")
    private String img_content_type;

    @Field("img_name")
    private String img_name;

    @Field("video_content_type")
    private String video_content_type;

    @Field("video_name")
    private String video_name;

    @Field("n_characters")
    private Integer n_characters;

    @Field("squeal_id_response")
    private String squeal_id_response;

    @Field("refresh_time")
    private Integer refresh_time;

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

    public String getUser_id() {
        return this.user_id;
    }

    public Squeal userId(String userId) {
        this.setUser_id(userId);
        return this;
    }

    public void setUser_id(String userId) {
        this.user_id = userId;
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

    public String getImg_content_type() {
        return this.img_content_type;
    }

    public Squeal imgContentType(String imgContentType) {
        this.img_content_type = imgContentType;
        return this;
    }

    public void setImg_content_type(String imgContentType) {
        this.img_content_type = imgContentType;
    }

    public String getImg_name() {
        return this.img_name;
    }

    public Squeal imgName(String imgName) {
        this.setImg_name(imgName);
        return this;
    }

    public void setImg_name(String imgName) {
        this.img_name = imgName;
    }

    public String getVideo_content_type() {
        return this.video_content_type;
    }

    public Squeal videoContentType(String videoContentType) {
        this.setVideo_content_type(videoContentType);
        return this;
    }

    public void setVideo_content_type(String videoContentType) {
        this.video_content_type = videoContentType;
    }

    public String getVideo_name() {
        return this.video_name;
    }

    public Squeal videoName(String videoName) {
        this.setVideo_name(videoName);
        return this;
    }

    public void setVideo_name(String videoName) {
        this.video_name = videoName;
    }

    public Integer getN_characters() {
        return this.n_characters;
    }

    public Squeal nCharacters(Integer nCharacters) {
        this.setN_characters(nCharacters);
        return this;
    }

    public void setN_characters(Integer nCharacters) {
        this.n_characters = nCharacters;
    }

    public String getSqueal_id_response() {
        return this.squeal_id_response;
    }

    public Squeal squealIdResponse(String squealIdResponse) {
        this.setSqueal_id_response(squealIdResponse);
        return this;
    }

    public void setSqueal_id_response(String squealIdResponse) {
        this.squeal_id_response = squealIdResponse;
    }

    public Integer getRefresh_time() {
        return this.refresh_time;
    }

    public Squeal refreshTime(Integer refreshTime) {
        this.setRefresh_time(refreshTime);
        return this;
    }

    public void setRefresh_time(Integer refreshTime) {
        this.refresh_time = refreshTime;
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
            ", userId='" + getUser_id() + "'" +
            ", timestamp=" + getTimestamp() +
            ", body='" + getBody() + "'" +
            ", img='" + getImg() + "'" +
            ", imgContentType='" + getImg_content_type() + "'" +
            ", imgName='" + getImg_name() + "'" +
            ", videoContentType='" + getVideo_content_type() + "'" +
            ", videoName='" + getVideo_name() + "'" +
            ", nCharacters=" + getN_characters() +
            ", squealIdResponse='" + getSqueal_id_response() + "'" +
            ", refreshTime=" + getRefresh_time() +
            "}";
    }
}
