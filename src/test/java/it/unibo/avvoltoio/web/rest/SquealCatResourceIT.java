package it.unibo.avvoltoio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import it.unibo.avvoltoio.IntegrationTest;
import it.unibo.avvoltoio.domain.SquealCat;
import it.unibo.avvoltoio.domain.enumeration.CategoryTypes;
import it.unibo.avvoltoio.repository.SquealCatRepository;
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
 * Integration tests for the {@link SquealCatResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SquealCatResourceIT {

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final String DEFAULT_SQUEAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_SQUEAL_ID = "BBBBBBBBBB";

    private static final CategoryTypes DEFAULT_CATEGORY = CategoryTypes.POPULAR;
    private static final CategoryTypes UPDATED_CATEGORY = CategoryTypes.UNPOPULAR;

    private static final Integer DEFAULT_N_CHARACTERS = 1;
    private static final Integer UPDATED_N_CHARACTERS = 2;

    private static final Long DEFAULT_TIMESTAMP = 1L;
    private static final Long UPDATED_TIMESTAMP = 2L;

    private static final String ENTITY_API_URL = "/api/squeal-cats";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SquealCatRepository squealCatRepository;

    @Autowired
    private MockMvc restSquealCatMockMvc;

    private SquealCat squealCat;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SquealCat createEntity() {
        SquealCat squealCat = new SquealCat()
            .userId(DEFAULT_USER_ID)
            .squealId(DEFAULT_SQUEAL_ID)
            .category(DEFAULT_CATEGORY)
            .nCharacters(DEFAULT_N_CHARACTERS)
            .timestamp(DEFAULT_TIMESTAMP);
        return squealCat;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SquealCat createUpdatedEntity() {
        SquealCat squealCat = new SquealCat()
            .userId(UPDATED_USER_ID)
            .squealId(UPDATED_SQUEAL_ID)
            .category(UPDATED_CATEGORY)
            .nCharacters(UPDATED_N_CHARACTERS)
            .timestamp(UPDATED_TIMESTAMP);
        return squealCat;
    }

    @BeforeEach
    public void initTest() {
        squealCatRepository.deleteAll();
        squealCat = createEntity();
    }

    @Test
    void createSquealCat() throws Exception {
        int databaseSizeBeforeCreate = squealCatRepository.findAll().size();
        // Create the SquealCat
        restSquealCatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squealCat)))
            .andExpect(status().isCreated());

        // Validate the SquealCat in the database
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeCreate + 1);
        SquealCat testSquealCat = squealCatList.get(squealCatList.size() - 1);
        assertThat(testSquealCat.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testSquealCat.getSquealId()).isEqualTo(DEFAULT_SQUEAL_ID);
        assertThat(testSquealCat.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testSquealCat.getnCharacters()).isEqualTo(DEFAULT_N_CHARACTERS);
        assertThat(testSquealCat.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    void createSquealCatWithExistingId() throws Exception {
        // Create the SquealCat with an existing ID
        squealCat.setId("existing_id");

        int databaseSizeBeforeCreate = squealCatRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSquealCatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squealCat)))
            .andExpect(status().isBadRequest());

        // Validate the SquealCat in the database
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllSquealCats() throws Exception {
        // Initialize the database
        squealCatRepository.save(squealCat);

        // Get all the squealCatList
        restSquealCatMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(squealCat.getId())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].squealId").value(hasItem(DEFAULT_SQUEAL_ID)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY.toString())))
            .andExpect(jsonPath("$.[*].nCharacters").value(hasItem(DEFAULT_N_CHARACTERS)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.intValue())));
    }

    @Test
    void getSquealCat() throws Exception {
        // Initialize the database
        squealCatRepository.save(squealCat);

        // Get the squealCat
        restSquealCatMockMvc
            .perform(get(ENTITY_API_URL_ID, squealCat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(squealCat.getId()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.squealId").value(DEFAULT_SQUEAL_ID))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY.toString()))
            .andExpect(jsonPath("$.nCharacters").value(DEFAULT_N_CHARACTERS))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.intValue()));
    }

    @Test
    void getNonExistingSquealCat() throws Exception {
        // Get the squealCat
        restSquealCatMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingSquealCat() throws Exception {
        // Initialize the database
        squealCatRepository.save(squealCat);

        int databaseSizeBeforeUpdate = squealCatRepository.findAll().size();

        // Update the squealCat
        SquealCat updatedSquealCat = squealCatRepository.findById(squealCat.getId()).orElseThrow();
        updatedSquealCat
            .userId(UPDATED_USER_ID)
            .squealId(UPDATED_SQUEAL_ID)
            .category(UPDATED_CATEGORY)
            .nCharacters(UPDATED_N_CHARACTERS)
            .timestamp(UPDATED_TIMESTAMP);

        restSquealCatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSquealCat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSquealCat))
            )
            .andExpect(status().isOk());

        // Validate the SquealCat in the database
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeUpdate);
        SquealCat testSquealCat = squealCatList.get(squealCatList.size() - 1);
        assertThat(testSquealCat.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testSquealCat.getSquealId()).isEqualTo(UPDATED_SQUEAL_ID);
        assertThat(testSquealCat.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testSquealCat.getnCharacters()).isEqualTo(UPDATED_N_CHARACTERS);
        assertThat(testSquealCat.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    void putNonExistingSquealCat() throws Exception {
        int databaseSizeBeforeUpdate = squealCatRepository.findAll().size();
        squealCat.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSquealCatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, squealCat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(squealCat))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealCat in the database
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSquealCat() throws Exception {
        int databaseSizeBeforeUpdate = squealCatRepository.findAll().size();
        squealCat.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealCatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(squealCat))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealCat in the database
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSquealCat() throws Exception {
        int databaseSizeBeforeUpdate = squealCatRepository.findAll().size();
        squealCat.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealCatMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squealCat)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SquealCat in the database
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSquealCatWithPatch() throws Exception {
        // Initialize the database
        squealCatRepository.save(squealCat);

        int databaseSizeBeforeUpdate = squealCatRepository.findAll().size();

        // Update the squealCat using partial update
        SquealCat partialUpdatedSquealCat = new SquealCat();
        partialUpdatedSquealCat.setId(squealCat.getId());

        partialUpdatedSquealCat.userId(UPDATED_USER_ID).squealId(UPDATED_SQUEAL_ID).timestamp(UPDATED_TIMESTAMP);

        restSquealCatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSquealCat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSquealCat))
            )
            .andExpect(status().isOk());

        // Validate the SquealCat in the database
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeUpdate);
        SquealCat testSquealCat = squealCatList.get(squealCatList.size() - 1);
        assertThat(testSquealCat.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testSquealCat.getSquealId()).isEqualTo(UPDATED_SQUEAL_ID);
        assertThat(testSquealCat.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testSquealCat.getnCharacters()).isEqualTo(DEFAULT_N_CHARACTERS);
        assertThat(testSquealCat.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    void fullUpdateSquealCatWithPatch() throws Exception {
        // Initialize the database
        squealCatRepository.save(squealCat);

        int databaseSizeBeforeUpdate = squealCatRepository.findAll().size();

        // Update the squealCat using partial update
        SquealCat partialUpdatedSquealCat = new SquealCat();
        partialUpdatedSquealCat.setId(squealCat.getId());

        partialUpdatedSquealCat
            .userId(UPDATED_USER_ID)
            .squealId(UPDATED_SQUEAL_ID)
            .category(UPDATED_CATEGORY)
            .nCharacters(UPDATED_N_CHARACTERS)
            .timestamp(UPDATED_TIMESTAMP);

        restSquealCatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSquealCat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSquealCat))
            )
            .andExpect(status().isOk());

        // Validate the SquealCat in the database
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeUpdate);
        SquealCat testSquealCat = squealCatList.get(squealCatList.size() - 1);
        assertThat(testSquealCat.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testSquealCat.getSquealId()).isEqualTo(UPDATED_SQUEAL_ID);
        assertThat(testSquealCat.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testSquealCat.getnCharacters()).isEqualTo(UPDATED_N_CHARACTERS);
        assertThat(testSquealCat.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    void patchNonExistingSquealCat() throws Exception {
        int databaseSizeBeforeUpdate = squealCatRepository.findAll().size();
        squealCat.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSquealCatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, squealCat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(squealCat))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealCat in the database
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSquealCat() throws Exception {
        int databaseSizeBeforeUpdate = squealCatRepository.findAll().size();
        squealCat.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealCatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(squealCat))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealCat in the database
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSquealCat() throws Exception {
        int databaseSizeBeforeUpdate = squealCatRepository.findAll().size();
        squealCat.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealCatMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(squealCat))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SquealCat in the database
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSquealCat() throws Exception {
        // Initialize the database
        squealCatRepository.save(squealCat);

        int databaseSizeBeforeDelete = squealCatRepository.findAll().size();

        // Delete the squealCat
        restSquealCatMockMvc
            .perform(delete(ENTITY_API_URL_ID, squealCat.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SquealCat> squealCatList = squealCatRepository.findAll();
        assertThat(squealCatList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
