package it.unibo.avvoltoio.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.unibo.avvoltoio.config.Constants;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A user.
 */
@org.springframework.data.mongodb.core.mapping.Document(collection = "jhi_user")
public class User extends AbstractAuditingEntity<String> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Size(min = 1, max = 50)
    @Indexed
    private String login;

    @JsonIgnore
    @NotNull
    @Size(min = 60, max = 60)
    private String password;

    @Size(max = 50)
    @Field("first_name")
    private String first_name;

    @Size(max = 50)
    @Field("last_name")
    private String last_name;

    @Email
    @Size(min = 5, max = 254)
    @Indexed
    private String email;

    private boolean activated = false;

    @Size(min = 2, max = 10)
    @Field("lang_key")
    private String lang_key;

    @Size(max = 256)
    @Field("image_url")
    private String image_url;

    @Size(max = 20)
    @Field("activation_key")
    @JsonIgnore
    private String activationKey;

    @Size(max = 20)
    @Field("reset_key")
    @JsonIgnore
    private String resetKey;

    @Field("reset_date")
    private Instant reset_date = null;

    @Field("img")
    private byte[] img;

    @Field("img_content_type")
    private String img_content_type;

    public byte[] getImg() {
        return img;
    }

    public void setImg(byte[] img) {
        this.img = img;
    }

    public String getImg_content_type() {
        return img_content_type;
    }

    public void setImg_content_type(String imgContentType) {
        this.img_content_type = imgContentType;
    }

    @JsonIgnore
    private Set<Authority> authorities = new HashSet<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    // Lowercase the login before saving it in database
    public void setLogin(String login) {
        this.login = StringUtils.lowerCase(login, Locale.ENGLISH);
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return first_name;
    }

    public void setFirstName(String first_name) {
        this.first_name = first_name;
    }

    public String getLastName() {
        return last_name;
    }

    public void setLastName(String last_name) {
        this.last_name = last_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String imageUrl) {
        this.image_url = imageUrl;
    }

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public String getActivationKey() {
        return activationKey;
    }

    public void setActivationKey(String activationKey) {
        this.activationKey = activationKey;
    }

    public String getResetKey() {
        return resetKey;
    }

    public void setResetKey(String resetKey) {
        this.resetKey = resetKey;
    }

    public Instant getReset_date() {
        return reset_date;
    }

    public void setReset_date(Instant resetDate) {
        this.reset_date = resetDate;
    }

    public String getLang_key() {
        return lang_key;
    }

    public void setLang_key(String langKey) {
        this.lang_key = langKey;
    }

    public Set<Authority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<Authority> authorities) {
        this.authorities = authorities;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof User)) {
            return false;
        }
        return id != null && id.equals(((User) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "User{" +
            "login='" + login + '\'' +
            ", first_name='" + first_name + '\'' +
            ", last_name='" + last_name + '\'' +
            ", email='" + email + '\'' +
            ", imageUrl='" + image_url + '\'' +
            ", activated='" + activated + '\'' +
            ", langKey='" + lang_key + '\'' +
            ", activationKey='" + activationKey + '\'' +
            ", img='" + img + '\'' +
            ", imgContentType='" + img_content_type + '\'' +
            "}";
    }
}
