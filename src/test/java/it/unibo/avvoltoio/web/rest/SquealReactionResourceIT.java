package it.unibo.avvoltoio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import it.unibo.avvoltoio.IntegrationTest;
import it.unibo.avvoltoio.domain.SquealReaction;
import it.unibo.avvoltoio.repository.SquealReactionRepository;
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
 * Integration tests for the {@link SquealReactionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SquealReactionResourceIT {

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_SQUEAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_SQUEAL_ID = "BBBBBBBBBB";

    private static final Boolean DEFAULT_POSITIVE = false;
    private static final Boolean UPDATED_POSITIVE = true;

    private static final String DEFAULT_EMOJI = "AAAAAAAAAA";
    private static final String UPDATED_EMOJI = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/squeal-reactions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SquealReactionRepository squealReactionRepository;

    @Autowired
    private MockMvc restSquealReactionMockMvc;

    private SquealReaction squealReaction;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SquealReaction createEntity() {
        SquealReaction squealReaction = new SquealReaction()
            .userId(DEFAULT_USER_ID)
            .username(DEFAULT_USERNAME)
            .squealId(DEFAULT_SQUEAL_ID)
            .positive(DEFAULT_POSITIVE)
            .emoji(DEFAULT_EMOJI);
        return squealReaction;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SquealReaction createUpdatedEntity() {
        SquealReaction squealReaction = new SquealReaction()
            .userId(UPDATED_USER_ID)
            .username(UPDATED_USERNAME)
            .squealId(UPDATED_SQUEAL_ID)
            .positive(UPDATED_POSITIVE)
            .emoji(UPDATED_EMOJI);
        return squealReaction;
    }

    @BeforeEach
    public void initTest() {
        squealReactionRepository.deleteAll();
        squealReaction = createEntity();
    }

    @Test
    void createSquealReaction() throws Exception {
        int databaseSizeBeforeCreate = squealReactionRepository.findAll().size();
        // Create the SquealReaction
        restSquealReactionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squealReaction))
            )
            .andExpect(status().isCreated());

        // Validate the SquealReaction in the database
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeCreate + 1);
        SquealReaction testSquealReaction = squealReactionList.get(squealReactionList.size() - 1);
        assertThat(testSquealReaction.getUser_id()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testSquealReaction.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testSquealReaction.getSqueal_id()).isEqualTo(DEFAULT_SQUEAL_ID);
        assertThat(testSquealReaction.getPositive()).isEqualTo(DEFAULT_POSITIVE);
        assertThat(testSquealReaction.getEmoji()).isEqualTo(DEFAULT_EMOJI);
    }

    @Test
    void createSquealReactionWithExistingId() throws Exception {
        // Create the SquealReaction with an existing ID
        squealReaction.setId("existing_id");

        int databaseSizeBeforeCreate = squealReactionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSquealReactionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squealReaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealReaction in the database
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllSquealReactions() throws Exception {
        // Initialize the database
        squealReactionRepository.save(squealReaction);

        // Get all the squealReactionList
        restSquealReactionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(squealReaction.getId())))
            .andExpect(jsonPath("$.[*].user_id").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].squealId").value(hasItem(DEFAULT_SQUEAL_ID)))
            .andExpect(jsonPath("$.[*].positive").value(hasItem(DEFAULT_POSITIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].emoji").value(hasItem(DEFAULT_EMOJI)));
    }

    @Test
    void getSquealReaction() throws Exception {
        // Initialize the database
        squealReactionRepository.save(squealReaction);

        // Get the squealReaction
        restSquealReactionMockMvc
            .perform(get(ENTITY_API_URL_ID, squealReaction.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(squealReaction.getId()))
            .andExpect(jsonPath("$.user_id").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.squealId").value(DEFAULT_SQUEAL_ID))
            .andExpect(jsonPath("$.positive").value(DEFAULT_POSITIVE.booleanValue()))
            .andExpect(jsonPath("$.emoji").value(DEFAULT_EMOJI));
    }

    @Test
    void getNonExistingSquealReaction() throws Exception {
        // Get the squealReaction
        restSquealReactionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingSquealReaction() throws Exception {
        // Initialize the database
        squealReactionRepository.save(squealReaction);

        int databaseSizeBeforeUpdate = squealReactionRepository.findAll().size();

        // Update the squealReaction
        SquealReaction updatedSquealReaction = squealReactionRepository.findById(squealReaction.getId()).orElseThrow();
        updatedSquealReaction
            .userId(UPDATED_USER_ID)
            .username(UPDATED_USERNAME)
            .squealId(UPDATED_SQUEAL_ID)
            .positive(UPDATED_POSITIVE)
            .emoji(UPDATED_EMOJI);

        restSquealReactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSquealReaction.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSquealReaction))
            )
            .andExpect(status().isOk());

        // Validate the SquealReaction in the database
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeUpdate);
        SquealReaction testSquealReaction = squealReactionList.get(squealReactionList.size() - 1);
        assertThat(testSquealReaction.getUser_id()).isEqualTo(UPDATED_USER_ID);
        assertThat(testSquealReaction.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testSquealReaction.getSqueal_id()).isEqualTo(UPDATED_SQUEAL_ID);
        assertThat(testSquealReaction.getPositive()).isEqualTo(UPDATED_POSITIVE);
        assertThat(testSquealReaction.getEmoji()).isEqualTo(UPDATED_EMOJI);
    }

    @Test
    void putNonExistingSquealReaction() throws Exception {
        int databaseSizeBeforeUpdate = squealReactionRepository.findAll().size();
        squealReaction.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSquealReactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, squealReaction.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(squealReaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealReaction in the database
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSquealReaction() throws Exception {
        int databaseSizeBeforeUpdate = squealReactionRepository.findAll().size();
        squealReaction.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealReactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(squealReaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealReaction in the database
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSquealReaction() throws Exception {
        int databaseSizeBeforeUpdate = squealReactionRepository.findAll().size();
        squealReaction.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealReactionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squealReaction)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SquealReaction in the database
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSquealReactionWithPatch() throws Exception {
        // Initialize the database
        squealReactionRepository.save(squealReaction);

        int databaseSizeBeforeUpdate = squealReactionRepository.findAll().size();

        // Update the squealReaction using partial update
        SquealReaction partialUpdatedSquealReaction = new SquealReaction();
        partialUpdatedSquealReaction.setId(squealReaction.getId());

        partialUpdatedSquealReaction.positive(UPDATED_POSITIVE).emoji(UPDATED_EMOJI);

        restSquealReactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSquealReaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSquealReaction))
            )
            .andExpect(status().isOk());

        // Validate the SquealReaction in the database
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeUpdate);
        SquealReaction testSquealReaction = squealReactionList.get(squealReactionList.size() - 1);
        assertThat(testSquealReaction.getUser_id()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testSquealReaction.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testSquealReaction.getSqueal_id()).isEqualTo(DEFAULT_SQUEAL_ID);
        assertThat(testSquealReaction.getPositive()).isEqualTo(UPDATED_POSITIVE);
        assertThat(testSquealReaction.getEmoji()).isEqualTo(UPDATED_EMOJI);
    }

    @Test
    void fullUpdateSquealReactionWithPatch() throws Exception {
        // Initialize the database
        squealReactionRepository.save(squealReaction);

        int databaseSizeBeforeUpdate = squealReactionRepository.findAll().size();

        // Update the squealReaction using partial update
        SquealReaction partialUpdatedSquealReaction = new SquealReaction();
        partialUpdatedSquealReaction.setId(squealReaction.getId());

        partialUpdatedSquealReaction
            .userId(UPDATED_USER_ID)
            .username(UPDATED_USERNAME)
            .squealId(UPDATED_SQUEAL_ID)
            .positive(UPDATED_POSITIVE)
            .emoji(UPDATED_EMOJI);

        restSquealReactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSquealReaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSquealReaction))
            )
            .andExpect(status().isOk());

        // Validate the SquealReaction in the database
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeUpdate);
        SquealReaction testSquealReaction = squealReactionList.get(squealReactionList.size() - 1);
        assertThat(testSquealReaction.getUser_id()).isEqualTo(UPDATED_USER_ID);
        assertThat(testSquealReaction.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testSquealReaction.getSqueal_id()).isEqualTo(UPDATED_SQUEAL_ID);
        assertThat(testSquealReaction.getPositive()).isEqualTo(UPDATED_POSITIVE);
        assertThat(testSquealReaction.getEmoji()).isEqualTo(UPDATED_EMOJI);
    }

    @Test
    void patchNonExistingSquealReaction() throws Exception {
        int databaseSizeBeforeUpdate = squealReactionRepository.findAll().size();
        squealReaction.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSquealReactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, squealReaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(squealReaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealReaction in the database
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSquealReaction() throws Exception {
        int databaseSizeBeforeUpdate = squealReactionRepository.findAll().size();
        squealReaction.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealReactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(squealReaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the SquealReaction in the database
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSquealReaction() throws Exception {
        int databaseSizeBeforeUpdate = squealReactionRepository.findAll().size();
        squealReaction.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealReactionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(squealReaction))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SquealReaction in the database
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSquealReaction() throws Exception {
        // Initialize the database
        squealReactionRepository.save(squealReaction);

        int databaseSizeBeforeDelete = squealReactionRepository.findAll().size();

        // Delete the squealReaction
        restSquealReactionMockMvc
            .perform(delete(ENTITY_API_URL_ID, squealReaction.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SquealReaction> squealReactionList = squealReactionRepository.findAll();
        assertThat(squealReactionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
