package it.unibo.avvoltoio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import it.unibo.avvoltoio.IntegrationTest;
import it.unibo.avvoltoio.domain.SquealViews;
import it.unibo.avvoltoio.repository.SquealViewsRepository;
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
 * Integration tests for the {@link SquealViewsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SquealViewsResourceIT {

    private static final String DEFAULT_SQUEAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_SQUEAL_ID = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMBER = 1;
    private static final Integer UPDATED_NUMBER = 2;

    private static final String ENTITY_API_URL = "/api/squeal-views";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SquealViewsRepository squealViewsRepository;

    @Autowired
    private MockMvc restSquealViewsMockMvc;

    private SquealViews squealViews;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SquealViews createEntity() {
        SquealViews squealViews = new SquealViews().squealId(DEFAULT_SQUEAL_ID).number(DEFAULT_NUMBER);
        return squealViews;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SquealViews createUpdatedEntity() {
        SquealViews squealViews = new SquealViews().squealId(UPDATED_SQUEAL_ID).number(UPDATED_NUMBER);
        return squealViews;
    }

    @BeforeEach
    public void initTest() {
        squealViewsRepository.deleteAll();
        squealViews = createEntity();
    }

    @Test
    void createSquealViews() throws Exception {
        int databaseSizeBeforeCreate = squealViewsRepository.findAll().size();
        // Create the SquealViews
        restSquealViewsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squealViews)))
            .andExpect(status().isCreated());

        // Validate the SquealViews in the database
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeCreate + 1);
        SquealViews testSquealViews = squealViewsList.get(squealViewsList.size() - 1);
        assertThat(testSquealViews.getSquealId()).isEqualTo(DEFAULT_SQUEAL_ID);
        assertThat(testSquealViews.getNumber()).isEqualTo(DEFAULT_NUMBER);
    }

    @Test
    void createSquealViewsWithExistingId() throws Exception {
        // Create the SquealViews with an existing ID
        squealViews.setId("existing_id");

        int databaseSizeBeforeCreate = squealViewsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSquealViewsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squealViews)))
            .andExpect(status().isBadRequest());

        // Validate the SquealViews in the database
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllSquealViews() throws Exception {
        // Initialize the database
        squealViewsRepository.save(squealViews);

        // Get all the squealViewsList
        restSquealViewsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(squealViews.getId())))
            .andExpect(jsonPath("$.[*].squealId").value(hasItem(DEFAULT_SQUEAL_ID)))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)));
    }

    @Test
    void getSquealViews() throws Exception {
        // Initialize the database
        squealViewsRepository.save(squealViews);

        // Get the squealViews
        restSquealViewsMockMvc
            .perform(get(ENTITY_API_URL_ID, squealViews.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(squealViews.getId()))
            .andExpect(jsonPath("$.squealId").value(DEFAULT_SQUEAL_ID))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER));
    }

    @Test
    void getNonExistingSquealViews() throws Exception {
        // Get the squealViews
        restSquealViewsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingSquealViews() throws Exception {
        // Initialize the database
        squealViewsRepository.save(squealViews);

        int databaseSizeBeforeUpdate = squealViewsRepository.findAll().size();

        // Update the squealViews
        SquealViews updatedSquealViews = squealViewsRepository.findById(squealViews.getId()).orElseThrow();
        updatedSquealViews.squealId(UPDATED_SQUEAL_ID).number(UPDATED_NUMBER);

        restSquealViewsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSquealViews.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSquealViews))
            )
            .andExpect(status().isOk());

        // Validate the SquealViews in the database
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeUpdate);
        SquealViews testSquealViews = squealViewsList.get(squealViewsList.size() - 1);
        assertThat(testSquealViews.getSquealId()).isEqualTo(UPDATED_SQUEAL_ID);
        assertThat(testSquealViews.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    void putNonExistingSquealViews() throws Exception {
        int databaseSizeBeforeUpdate = squealViewsRepository.findAll().size();
        squealViews.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSquealViewsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, squealViews.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(squealViews))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealViews in the database
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSquealViews() throws Exception {
        int databaseSizeBeforeUpdate = squealViewsRepository.findAll().size();
        squealViews.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealViewsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(squealViews))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealViews in the database
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSquealViews() throws Exception {
        int databaseSizeBeforeUpdate = squealViewsRepository.findAll().size();
        squealViews.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealViewsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squealViews)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SquealViews in the database
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSquealViewsWithPatch() throws Exception {
        // Initialize the database
        squealViewsRepository.save(squealViews);

        int databaseSizeBeforeUpdate = squealViewsRepository.findAll().size();

        // Update the squealViews using partial update
        SquealViews partialUpdatedSquealViews = new SquealViews();
        partialUpdatedSquealViews.setId(squealViews.getId());

        partialUpdatedSquealViews.number(UPDATED_NUMBER);

        restSquealViewsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSquealViews.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSquealViews))
            )
            .andExpect(status().isOk());

        // Validate the SquealViews in the database
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeUpdate);
        SquealViews testSquealViews = squealViewsList.get(squealViewsList.size() - 1);
        assertThat(testSquealViews.getSquealId()).isEqualTo(DEFAULT_SQUEAL_ID);
        assertThat(testSquealViews.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    void fullUpdateSquealViewsWithPatch() throws Exception {
        // Initialize the database
        squealViewsRepository.save(squealViews);

        int databaseSizeBeforeUpdate = squealViewsRepository.findAll().size();

        // Update the squealViews using partial update
        SquealViews partialUpdatedSquealViews = new SquealViews();
        partialUpdatedSquealViews.setId(squealViews.getId());

        partialUpdatedSquealViews.squealId(UPDATED_SQUEAL_ID).number(UPDATED_NUMBER);

        restSquealViewsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSquealViews.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSquealViews))
            )
            .andExpect(status().isOk());

        // Validate the SquealViews in the database
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeUpdate);
        SquealViews testSquealViews = squealViewsList.get(squealViewsList.size() - 1);
        assertThat(testSquealViews.getSquealId()).isEqualTo(UPDATED_SQUEAL_ID);
        assertThat(testSquealViews.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    void patchNonExistingSquealViews() throws Exception {
        int databaseSizeBeforeUpdate = squealViewsRepository.findAll().size();
        squealViews.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSquealViewsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, squealViews.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(squealViews))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealViews in the database
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSquealViews() throws Exception {
        int databaseSizeBeforeUpdate = squealViewsRepository.findAll().size();
        squealViews.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealViewsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(squealViews))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealViews in the database
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSquealViews() throws Exception {
        int databaseSizeBeforeUpdate = squealViewsRepository.findAll().size();
        squealViews.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealViewsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(squealViews))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SquealViews in the database
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSquealViews() throws Exception {
        // Initialize the database
        squealViewsRepository.save(squealViews);

        int databaseSizeBeforeDelete = squealViewsRepository.findAll().size();

        // Delete the squealViews
        restSquealViewsMockMvc
            .perform(delete(ENTITY_API_URL_ID, squealViews.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SquealViews> squealViewsList = squealViewsRepository.findAll();
        assertThat(squealViewsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
