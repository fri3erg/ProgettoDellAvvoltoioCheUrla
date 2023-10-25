package it.unibo.avvoltoio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import it.unibo.avvoltoio.IntegrationTest;
import it.unibo.avvoltoio.domain.SMMVIP;
import it.unibo.avvoltoio.repository.SMMVIPRepository;
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
 * Integration tests for the {@link SMMVIPResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SMMVIPResourceIT {

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/smmvips";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SMMVIPRepository sMMVIPRepository;

    @Autowired
    private MockMvc restSMMVIPMockMvc;

    private SMMVIP sMMVIP;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SMMVIP createEntity() {
        SMMVIP sMMVIP = new SMMVIP().userId(DEFAULT_USER_ID);
        return sMMVIP;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SMMVIP createUpdatedEntity() {
        SMMVIP sMMVIP = new SMMVIP().userId(UPDATED_USER_ID);
        return sMMVIP;
    }

    @BeforeEach
    public void initTest() {
        sMMVIPRepository.deleteAll();
        sMMVIP = createEntity();
    }

    @Test
    void createSMMVIP() throws Exception {
        int databaseSizeBeforeCreate = sMMVIPRepository.findAll().size();
        // Create the SMMVIP
        restSMMVIPMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sMMVIP)))
            .andExpect(status().isCreated());

        // Validate the SMMVIP in the database
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeCreate + 1);
        SMMVIP testSMMVIP = sMMVIPList.get(sMMVIPList.size() - 1);
        assertThat(testSMMVIP.getUserId()).isEqualTo(DEFAULT_USER_ID);
    }

    @Test
    void createSMMVIPWithExistingId() throws Exception {
        // Create the SMMVIP with an existing ID
        sMMVIP.setId("existing_id");

        int databaseSizeBeforeCreate = sMMVIPRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSMMVIPMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sMMVIP)))
            .andExpect(status().isBadRequest());

        // Validate the SMMVIP in the database
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllSMMVIPS() throws Exception {
        // Initialize the database
        sMMVIPRepository.save(sMMVIP);

        // Get all the sMMVIPList
        restSMMVIPMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sMMVIP.getId())))
            .andExpect(jsonPath("$.[*].user_id").value(hasItem(DEFAULT_USER_ID)));
    }

    @Test
    void getSMMVIP() throws Exception {
        // Initialize the database
        sMMVIPRepository.save(sMMVIP);

        // Get the sMMVIP
        restSMMVIPMockMvc
            .perform(get(ENTITY_API_URL_ID, sMMVIP.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sMMVIP.getId()))
            .andExpect(jsonPath("$.user_id").value(DEFAULT_USER_ID));
    }

    @Test
    void getNonExistingSMMVIP() throws Exception {
        // Get the sMMVIP
        restSMMVIPMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingSMMVIP() throws Exception {
        // Initialize the database
        sMMVIPRepository.save(sMMVIP);

        int databaseSizeBeforeUpdate = sMMVIPRepository.findAll().size();

        // Update the sMMVIP
        SMMVIP updatedSMMVIP = sMMVIPRepository.findById(sMMVIP.getId()).orElseThrow();
        updatedSMMVIP.userId(UPDATED_USER_ID);

        restSMMVIPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSMMVIP.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSMMVIP))
            )
            .andExpect(status().isOk());

        // Validate the SMMVIP in the database
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeUpdate);
        SMMVIP testSMMVIP = sMMVIPList.get(sMMVIPList.size() - 1);
        assertThat(testSMMVIP.getUserId()).isEqualTo(UPDATED_USER_ID);
    }

    @Test
    void putNonExistingSMMVIP() throws Exception {
        int databaseSizeBeforeUpdate = sMMVIPRepository.findAll().size();
        sMMVIP.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSMMVIPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sMMVIP.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sMMVIP))
            )
            .andExpect(status().isBadRequest());

        // Validate the SMMVIP in the database
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSMMVIP() throws Exception {
        int databaseSizeBeforeUpdate = sMMVIPRepository.findAll().size();
        sMMVIP.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSMMVIPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sMMVIP))
            )
            .andExpect(status().isBadRequest());

        // Validate the SMMVIP in the database
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSMMVIP() throws Exception {
        int databaseSizeBeforeUpdate = sMMVIPRepository.findAll().size();
        sMMVIP.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSMMVIPMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sMMVIP)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SMMVIP in the database
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSMMVIPWithPatch() throws Exception {
        // Initialize the database
        sMMVIPRepository.save(sMMVIP);

        int databaseSizeBeforeUpdate = sMMVIPRepository.findAll().size();

        // Update the sMMVIP using partial update
        SMMVIP partialUpdatedSMMVIP = new SMMVIP();
        partialUpdatedSMMVIP.setId(sMMVIP.getId());

        restSMMVIPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSMMVIP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSMMVIP))
            )
            .andExpect(status().isOk());

        // Validate the SMMVIP in the database
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeUpdate);
        SMMVIP testSMMVIP = sMMVIPList.get(sMMVIPList.size() - 1);
        assertThat(testSMMVIP.getUserId()).isEqualTo(DEFAULT_USER_ID);
    }

    @Test
    void fullUpdateSMMVIPWithPatch() throws Exception {
        // Initialize the database
        sMMVIPRepository.save(sMMVIP);

        int databaseSizeBeforeUpdate = sMMVIPRepository.findAll().size();

        // Update the sMMVIP using partial update
        SMMVIP partialUpdatedSMMVIP = new SMMVIP();
        partialUpdatedSMMVIP.setId(sMMVIP.getId());

        partialUpdatedSMMVIP.userId(UPDATED_USER_ID);

        restSMMVIPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSMMVIP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSMMVIP))
            )
            .andExpect(status().isOk());

        // Validate the SMMVIP in the database
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeUpdate);
        SMMVIP testSMMVIP = sMMVIPList.get(sMMVIPList.size() - 1);
        assertThat(testSMMVIP.getUserId()).isEqualTo(UPDATED_USER_ID);
    }

    @Test
    void patchNonExistingSMMVIP() throws Exception {
        int databaseSizeBeforeUpdate = sMMVIPRepository.findAll().size();
        sMMVIP.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSMMVIPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sMMVIP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sMMVIP))
            )
            .andExpect(status().isBadRequest());

        // Validate the SMMVIP in the database
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSMMVIP() throws Exception {
        int databaseSizeBeforeUpdate = sMMVIPRepository.findAll().size();
        sMMVIP.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSMMVIPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sMMVIP))
            )
            .andExpect(status().isBadRequest());

        // Validate the SMMVIP in the database
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSMMVIP() throws Exception {
        int databaseSizeBeforeUpdate = sMMVIPRepository.findAll().size();
        sMMVIP.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSMMVIPMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sMMVIP)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SMMVIP in the database
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSMMVIP() throws Exception {
        // Initialize the database
        sMMVIPRepository.save(sMMVIP);

        int databaseSizeBeforeDelete = sMMVIPRepository.findAll().size();

        // Delete the sMMVIP
        restSMMVIPMockMvc
            .perform(delete(ENTITY_API_URL_ID, sMMVIP.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SMMVIP> sMMVIPList = sMMVIPRepository.findAll();
        assertThat(sMMVIPList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
