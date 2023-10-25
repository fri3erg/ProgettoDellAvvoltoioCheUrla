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
    private String user_id;

    @Field("n_characters")
    private Integer n_characters;

    @Field("timestamp_bought")
    private Long timestamp_bought;

    @Field("timestamp_expire")
    private Long timestamp_expire;

    @Field("amount")
    private BigDecimal amount;

    @Field("admin_discount")
    private Boolean admin_discount;

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

    public String getUser_id() {
        return this.user_id;
    }

    public CharactersPurchased userId(String userId) {
        this.setUser_id(userId);
        return this;
    }

    public void setUser_id(String userId) {
        this.user_id = userId;
    }

    public Integer getN_characters() {
        return this.n_characters;
    }

    public CharactersPurchased nCharacters(Integer nCharacters) {
        this.setN_characters(nCharacters);
        return this;
    }

    public void setN_characters(Integer nCharacters) {
        this.n_characters = nCharacters;
    }

    public Long getTimestamp_bought() {
        return this.timestamp_bought;
    }

    public CharactersPurchased timestampBought(Long timestampBought) {
        this.setTimestamp_bought(timestampBought);
        return this;
    }

    public void setTimestamp_bought(Long timestampBought) {
        this.timestamp_bought = timestampBought;
    }

    public Long getTimestamp_expire() {
        return this.timestamp_expire;
    }

    public CharactersPurchased timestampExpire(Long timestampExpire) {
        this.setTimestamp_expire(timestampExpire);
        return this;
    }

    public void setTimestamp_expire(Long timestampExpire) {
        this.timestamp_expire = timestampExpire;
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

    public Boolean getAdmin_discount() {
        return this.admin_discount;
    }

    public CharactersPurchased adminDiscount(Boolean adminDiscount) {
        this.setAdmin_discount(adminDiscount);
        return this;
    }

    public void setAdmin_discount(Boolean adminDiscount) {
        this.admin_discount = adminDiscount;
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
            ", userId='" + getUser_id() + "'" +
            ", nCharacters=" + getN_characters() +
            ", timestampBought=" + getTimestamp_bought() +
            ", timestampExpire=" + getTimestamp_expire() +
            ", amount=" + getAmount() +
            ", adminDiscount='" + getAdmin_discount() + "'" +
            "}";
    }
}
