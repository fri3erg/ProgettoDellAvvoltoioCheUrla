package it.unibo.avvoltoio.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A CharactersPurchased.
 */
@Document(collection = "characters_purchased")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CharactersPurchased implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("n_characters")
    private Integer nCharacters;

    @Field("timestamp_bought")
    private Long timestampBought;

    @Field("timestamp_expire")
    private Long timestampExpire;

    @Field("amount")
    private BigDecimal amount;

    @Field("admin_discount")
    private Boolean adminDiscount;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public CharactersPurchased id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return this.userId;
    }

    public CharactersPurchased userId(String userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getnCharacters() {
        return this.nCharacters;
    }

    public CharactersPurchased nCharacters(Integer nCharacters) {
        this.setnCharacters(nCharacters);
        return this;
    }

    public void setnCharacters(Integer nCharacters) {
        this.nCharacters = nCharacters;
    }

    public Long getTimestampBought() {
        return this.timestampBought;
    }

    public CharactersPurchased timestampBought(Long timestampBought) {
        this.setTimestampBought(timestampBought);
        return this;
    }

    public void setTimestampBought(Long timestampBought) {
        this.timestampBought = timestampBought;
    }

    public Long getTimestampExpire() {
        return this.timestampExpire;
    }

    public CharactersPurchased timestampExpire(Long timestampExpire) {
        this.setTimestampExpire(timestampExpire);
        return this;
    }

    public void setTimestampExpire(Long timestampExpire) {
        this.timestampExpire = timestampExpire;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public CharactersPurchased amount(BigDecimal amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Boolean getAdminDiscount() {
        return this.adminDiscount;
    }

    public CharactersPurchased adminDiscount(Boolean adminDiscount) {
        this.setAdminDiscount(adminDiscount);
        return this;
    }

    public void setAdminDiscount(Boolean adminDiscount) {
        this.adminDiscount = adminDiscount;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CharactersPurchased)) {
            return false;
        }
        return id != null && id.equals(((CharactersPurchased) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CharactersPurchased{" +
            "id=" + getId() +
            ", userId='" + getUserId() + "'" +
            ", nCharacters=" + getnCharacters() +
            ", timestampBought=" + getTimestampBought() +
            ", timestampExpire=" + getTimestampExpire() +
            ", amount=" + getAmount() +
            ", adminDiscount='" + getAdminDiscount() + "'" +
            "}";
    }
}
