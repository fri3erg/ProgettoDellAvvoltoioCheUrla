package it.unibo.avvoltoio.web.rest;

import static it.unibo.avvoltoio.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import it.unibo.avvoltoio.IntegrationTest;
import it.unibo.avvoltoio.domain.CharactersPurchased;
import it.unibo.avvoltoio.repository.CharactersPurchasedRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link CharactersPurchasedResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CharactersPurchasedResourceIT {

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final Integer DEFAULT_N_CHARACTERS = 1;
    private static final Integer UPDATED_N_CHARACTERS = 2;

    private static final Long DEFAULT_TIMESTAMP_BOUGHT = 1L;
    private static final Long UPDATED_TIMESTAMP_BOUGHT = 2L;

    private static final Long DEFAULT_TIMESTAMP_EXPIRE = 1L;
    private static final Long UPDATED_TIMESTAMP_EXPIRE = 2L;

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final Boolean DEFAULT_ADMIN_DISCOUNT = false;
    private static final Boolean UPDATED_ADMIN_DISCOUNT = true;

    private static final String ENTITY_API_URL = "/api/characters-purchaseds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private CharactersPurchasedRepository charactersPurchasedRepository;

    @Autowired
    private MockMvc restCharactersPurchasedMockMvc;

    private CharactersPurchased charactersPurchased;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharactersPurchased createEntity() {
        CharactersPurchased charactersPurchased = new CharactersPurchased()
            .userId(DEFAULT_USER_ID)
            .nCharacters(DEFAULT_N_CHARACTERS)
            .timestampBought(DEFAULT_TIMESTAMP_BOUGHT)
            .timestampExpire(DEFAULT_TIMESTAMP_EXPIRE)
            .amount(DEFAULT_AMOUNT)
            .adminDiscount(DEFAULT_ADMIN_DISCOUNT);
        return charactersPurchased;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharactersPurchased createUpdatedEntity() {
        CharactersPurchased charactersPurchased = new CharactersPurchased()
            .userId(UPDATED_USER_ID)
            .nCharacters(UPDATED_N_CHARACTERS)
            .timestampBought(UPDATED_TIMESTAMP_BOUGHT)
            .timestampExpire(UPDATED_TIMESTAMP_EXPIRE)
            .amount(UPDATED_AMOUNT)
            .adminDiscount(UPDATED_ADMIN_DISCOUNT);
        return charactersPurchased;
    }

    @BeforeEach
    public void initTest() {
        charactersPurchasedRepository.deleteAll();
        charactersPurchased = createEntity();
    }

    @Test
    void createCharactersPurchased() throws Exception {
        int databaseSizeBeforeCreate = charactersPurchasedRepository.findAll().size();
        // Create the CharactersPurchased
        restCharactersPurchasedMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charactersPurchased))
            )
            .andExpect(status().isCreated());

        // Validate the CharactersPurchased in the database
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeCreate + 1);
        CharactersPurchased testCharactersPurchased = charactersPurchasedList.get(charactersPurchasedList.size() - 1);
        assertThat(testCharactersPurchased.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testCharactersPurchased.getnCharacters()).isEqualTo(DEFAULT_N_CHARACTERS);
        assertThat(testCharactersPurchased.getTimestampBought()).isEqualTo(DEFAULT_TIMESTAMP_BOUGHT);
        assertThat(testCharactersPurchased.getTimestampExpire()).isEqualTo(DEFAULT_TIMESTAMP_EXPIRE);
        assertThat(testCharactersPurchased.getAmount()).isEqualByComparingTo(DEFAULT_AMOUNT);
        assertThat(testCharactersPurchased.getAdminDiscount()).isEqualTo(DEFAULT_ADMIN_DISCOUNT);
    }

    @Test
    void createCharactersPurchasedWithExistingId() throws Exception {
        // Create the CharactersPurchased with an existing ID
        charactersPurchased.setId("existing_id");

        int databaseSizeBeforeCreate = charactersPurchasedRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCharactersPurchasedMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charactersPurchased))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharactersPurchased in the database
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllCharactersPurchaseds() throws Exception {
        // Initialize the database
        charactersPurchasedRepository.save(charactersPurchased);

        // Get all the charactersPurchasedList
        restCharactersPurchasedMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(charactersPurchased.getId())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].nCharacters").value(hasItem(DEFAULT_N_CHARACTERS)))
            .andExpect(jsonPath("$.[*].timestampBought").value(hasItem(DEFAULT_TIMESTAMP_BOUGHT.intValue())))
            .andExpect(jsonPath("$.[*].timestampExpire").value(hasItem(DEFAULT_TIMESTAMP_EXPIRE.intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(sameNumber(DEFAULT_AMOUNT))))
            .andExpect(jsonPath("$.[*].adminDiscount").value(hasItem(DEFAULT_ADMIN_DISCOUNT.booleanValue())));
    }

    @Test
    void getCharactersPurchased() throws Exception {
        // Initialize the database
        charactersPurchasedRepository.save(charactersPurchased);

        // Get the charactersPurchased
        restCharactersPurchasedMockMvc
            .perform(get(ENTITY_API_URL_ID, charactersPurchased.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(charactersPurchased.getId()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.nCharacters").value(DEFAULT_N_CHARACTERS))
            .andExpect(jsonPath("$.timestampBought").value(DEFAULT_TIMESTAMP_BOUGHT.intValue()))
            .andExpect(jsonPath("$.timestampExpire").value(DEFAULT_TIMESTAMP_EXPIRE.intValue()))
            .andExpect(jsonPath("$.amount").value(sameNumber(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.adminDiscount").value(DEFAULT_ADMIN_DISCOUNT.booleanValue()));
    }

    @Test
    void getNonExistingCharactersPurchased() throws Exception {
        // Get the charactersPurchased
        restCharactersPurchasedMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingCharactersPurchased() throws Exception {
        // Initialize the database
        charactersPurchasedRepository.save(charactersPurchased);

        int databaseSizeBeforeUpdate = charactersPurchasedRepository.findAll().size();

        // Update the charactersPurchased
        CharactersPurchased updatedCharactersPurchased = charactersPurchasedRepository.findById(charactersPurchased.getId()).orElseThrow();
        updatedCharactersPurchased
            .userId(UPDATED_USER_ID)
            .nCharacters(UPDATED_N_CHARACTERS)
            .timestampBought(UPDATED_TIMESTAMP_BOUGHT)
            .timestampExpire(UPDATED_TIMESTAMP_EXPIRE)
            .amount(UPDATED_AMOUNT)
            .adminDiscount(UPDATED_ADMIN_DISCOUNT);

        restCharactersPurchasedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCharactersPurchased.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCharactersPurchased))
            )
            .andExpect(status().isOk());

        // Validate the CharactersPurchased in the database
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeUpdate);
        CharactersPurchased testCharactersPurchased = charactersPurchasedList.get(charactersPurchasedList.size() - 1);
        assertThat(testCharactersPurchased.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testCharactersPurchased.getnCharacters()).isEqualTo(UPDATED_N_CHARACTERS);
        assertThat(testCharactersPurchased.getTimestampBought()).isEqualTo(UPDATED_TIMESTAMP_BOUGHT);
        assertThat(testCharactersPurchased.getTimestampExpire()).isEqualTo(UPDATED_TIMESTAMP_EXPIRE);
        assertThat(testCharactersPurchased.getAmount()).isEqualByComparingTo(UPDATED_AMOUNT);
        assertThat(testCharactersPurchased.getAdminDiscount()).isEqualTo(UPDATED_ADMIN_DISCOUNT);
    }

    @Test
    void putNonExistingCharactersPurchased() throws Exception {
        int databaseSizeBeforeUpdate = charactersPurchasedRepository.findAll().size();
        charactersPurchased.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharactersPurchasedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, charactersPurchased.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charactersPurchased))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharactersPurchased in the database
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchCharactersPurchased() throws Exception {
        int databaseSizeBeforeUpdate = charactersPurchasedRepository.findAll().size();
        charactersPurchased.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharactersPurchasedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charactersPurchased))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharactersPurchased in the database
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamCharactersPurchased() throws Exception {
        int databaseSizeBeforeUpdate = charactersPurchasedRepository.findAll().size();
        charactersPurchased.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharactersPurchasedMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charactersPurchased))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharactersPurchased in the database
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateCharactersPurchasedWithPatch() throws Exception {
        // Initialize the database
        charactersPurchasedRepository.save(charactersPurchased);

        int databaseSizeBeforeUpdate = charactersPurchasedRepository.findAll().size();

        // Update the charactersPurchased using partial update
        CharactersPurchased partialUpdatedCharactersPurchased = new CharactersPurchased();
        partialUpdatedCharactersPurchased.setId(charactersPurchased.getId());

        partialUpdatedCharactersPurchased
            .nCharacters(UPDATED_N_CHARACTERS)
            .timestampExpire(UPDATED_TIMESTAMP_EXPIRE)
            .amount(UPDATED_AMOUNT)
            .adminDiscount(UPDATED_ADMIN_DISCOUNT);

        restCharactersPurchasedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharactersPurchased.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharactersPurchased))
            )
            .andExpect(status().isOk());

        // Validate the CharactersPurchased in the database
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeUpdate);
        CharactersPurchased testCharactersPurchased = charactersPurchasedList.get(charactersPurchasedList.size() - 1);
        assertThat(testCharactersPurchased.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testCharactersPurchased.getnCharacters()).isEqualTo(UPDATED_N_CHARACTERS);
        assertThat(testCharactersPurchased.getTimestampBought()).isEqualTo(DEFAULT_TIMESTAMP_BOUGHT);
        assertThat(testCharactersPurchased.getTimestampExpire()).isEqualTo(UPDATED_TIMESTAMP_EXPIRE);
        assertThat(testCharactersPurchased.getAmount()).isEqualByComparingTo(UPDATED_AMOUNT);
        assertThat(testCharactersPurchased.getAdminDiscount()).isEqualTo(UPDATED_ADMIN_DISCOUNT);
    }

    @Test
    void fullUpdateCharactersPurchasedWithPatch() throws Exception {
        // Initialize the database
        charactersPurchasedRepository.save(charactersPurchased);

        int databaseSizeBeforeUpdate = charactersPurchasedRepository.findAll().size();

        // Update the charactersPurchased using partial update
        CharactersPurchased partialUpdatedCharactersPurchased = new CharactersPurchased();
        partialUpdatedCharactersPurchased.setId(charactersPurchased.getId());

        partialUpdatedCharactersPurchased
            .userId(UPDATED_USER_ID)
            .nCharacters(UPDATED_N_CHARACTERS)
            .timestampBought(UPDATED_TIMESTAMP_BOUGHT)
            .timestampExpire(UPDATED_TIMESTAMP_EXPIRE)
            .amount(UPDATED_AMOUNT)
            .adminDiscount(UPDATED_ADMIN_DISCOUNT);

        restCharactersPurchasedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharactersPurchased.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharactersPurchased))
            )
            .andExpect(status().isOk());

        // Validate the CharactersPurchased in the database
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeUpdate);
        CharactersPurchased testCharactersPurchased = charactersPurchasedList.get(charactersPurchasedList.size() - 1);
        assertThat(testCharactersPurchased.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testCharactersPurchased.getnCharacters()).isEqualTo(UPDATED_N_CHARACTERS);
        assertThat(testCharactersPurchased.getTimestampBought()).isEqualTo(UPDATED_TIMESTAMP_BOUGHT);
        assertThat(testCharactersPurchased.getTimestampExpire()).isEqualTo(UPDATED_TIMESTAMP_EXPIRE);
        assertThat(testCharactersPurchased.getAmount()).isEqualByComparingTo(UPDATED_AMOUNT);
        assertThat(testCharactersPurchased.getAdminDiscount()).isEqualTo(UPDATED_ADMIN_DISCOUNT);
    }

    @Test
    void patchNonExistingCharactersPurchased() throws Exception {
        int databaseSizeBeforeUpdate = charactersPurchasedRepository.findAll().size();
        charactersPurchased.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharactersPurchasedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, charactersPurchased.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charactersPurchased))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharactersPurchased in the database
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchCharactersPurchased() throws Exception {
        int databaseSizeBeforeUpdate = charactersPurchasedRepository.findAll().size();
        charactersPurchased.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharactersPurchasedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charactersPurchased))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharactersPurchased in the database
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamCharactersPurchased() throws Exception {
        int databaseSizeBeforeUpdate = charactersPurchasedRepository.findAll().size();
        charactersPurchased.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharactersPurchasedMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charactersPurchased))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharactersPurchased in the database
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteCharactersPurchased() throws Exception {
        // Initialize the database
        charactersPurchasedRepository.save(charactersPurchased);

        int databaseSizeBeforeDelete = charactersPurchasedRepository.findAll().size();

        // Delete the charactersPurchased
        restCharactersPurchasedMockMvc
            .perform(delete(ENTITY_API_URL_ID, charactersPurchased.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CharactersPurchased> charactersPurchasedList = charactersPurchasedRepository.findAll();
        assertThat(charactersPurchasedList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
