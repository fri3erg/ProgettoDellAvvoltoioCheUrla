package it.unibo.avvoltoio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import it.unibo.avvoltoio.IntegrationTest;
import it.unibo.avvoltoio.domain.UserChars;
import it.unibo.avvoltoio.repository.UserCharsRepository;
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
 * Integration tests for the {@link UserCharsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserCharsResourceIT {

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final Integer DEFAULT_MAX_CHARS = 1;
    private static final Integer UPDATED_MAX_CHARS = 2;

    private static final Integer DEFAULT_REMANING_CHARS = 1;
    private static final Integer UPDATED_REMANING_CHARS = 2;

    private static final String ENTITY_API_URL = "/api/user-chars";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private UserCharsRepository userCharsRepository;

    @Autowired
    private MockMvc restUserCharsMockMvc;

    private UserChars userChars;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserChars createEntity() {
        UserChars userChars = new UserChars().userId(DEFAULT_USER_ID).maxChars(DEFAULT_MAX_CHARS).remaningChars(DEFAULT_REMANING_CHARS);
        return userChars;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserChars createUpdatedEntity() {
        UserChars userChars = new UserChars().userId(UPDATED_USER_ID).maxChars(UPDATED_MAX_CHARS).remaningChars(UPDATED_REMANING_CHARS);
        return userChars;
    }

    @BeforeEach
    public void initTest() {
        userCharsRepository.deleteAll();
        userChars = createEntity();
    }

    @Test
    void createUserChars() throws Exception {
        int databaseSizeBeforeCreate = userCharsRepository.findAll().size();
        // Create the UserChars
        restUserCharsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userChars)))
            .andExpect(status().isCreated());

        // Validate the UserChars in the database
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeCreate + 1);
        UserChars testUserChars = userCharsList.get(userCharsList.size() - 1);
        assertThat(testUserChars.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testUserChars.getMaxChars()).isEqualTo(DEFAULT_MAX_CHARS);
        assertThat(testUserChars.getRemaningChars()).isEqualTo(DEFAULT_REMANING_CHARS);
    }

    @Test
    void createUserCharsWithExistingId() throws Exception {
        // Create the UserChars with an existing ID
        userChars.setId("existing_id");

        int databaseSizeBeforeCreate = userCharsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserCharsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userChars)))
            .andExpect(status().isBadRequest());

        // Validate the UserChars in the database
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllUserChars() throws Exception {
        // Initialize the database
        userCharsRepository.save(userChars);

        // Get all the userCharsList
        restUserCharsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userChars.getId())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].maxChars").value(hasItem(DEFAULT_MAX_CHARS)))
            .andExpect(jsonPath("$.[*].remaningChars").value(hasItem(DEFAULT_REMANING_CHARS)));
    }

    @Test
    void getUserChars() throws Exception {
        // Initialize the database
        userCharsRepository.save(userChars);

        // Get the userChars
        restUserCharsMockMvc
            .perform(get(ENTITY_API_URL_ID, userChars.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userChars.getId()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.maxChars").value(DEFAULT_MAX_CHARS))
            .andExpect(jsonPath("$.remaningChars").value(DEFAULT_REMANING_CHARS));
    }

    @Test
    void getNonExistingUserChars() throws Exception {
        // Get the userChars
        restUserCharsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingUserChars() throws Exception {
        // Initialize the database
        userCharsRepository.save(userChars);

        int databaseSizeBeforeUpdate = userCharsRepository.findAll().size();

        // Update the userChars
        UserChars updatedUserChars = userCharsRepository.findById(userChars.getId()).orElseThrow();
        updatedUserChars.userId(UPDATED_USER_ID).maxChars(UPDATED_MAX_CHARS).remaningChars(UPDATED_REMANING_CHARS);

        restUserCharsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserChars.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserChars))
            )
            .andExpect(status().isOk());

        // Validate the UserChars in the database
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeUpdate);
        UserChars testUserChars = userCharsList.get(userCharsList.size() - 1);
        assertThat(testUserChars.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testUserChars.getMaxChars()).isEqualTo(UPDATED_MAX_CHARS);
        assertThat(testUserChars.getRemaningChars()).isEqualTo(UPDATED_REMANING_CHARS);
    }

    @Test
    void putNonExistingUserChars() throws Exception {
        int databaseSizeBeforeUpdate = userCharsRepository.findAll().size();
        userChars.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserCharsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userChars.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userChars))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserChars in the database
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchUserChars() throws Exception {
        int databaseSizeBeforeUpdate = userCharsRepository.findAll().size();
        userChars.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserCharsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userChars))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserChars in the database
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamUserChars() throws Exception {
        int databaseSizeBeforeUpdate = userCharsRepository.findAll().size();
        userChars.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserCharsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userChars)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserChars in the database
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateUserCharsWithPatch() throws Exception {
        // Initialize the database
        userCharsRepository.save(userChars);

        int databaseSizeBeforeUpdate = userCharsRepository.findAll().size();

        // Update the userChars using partial update
        UserChars partialUpdatedUserChars = new UserChars();
        partialUpdatedUserChars.setId(userChars.getId());

        partialUpdatedUserChars.maxChars(UPDATED_MAX_CHARS);

        restUserCharsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserChars.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserChars))
            )
            .andExpect(status().isOk());

        // Validate the UserChars in the database
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeUpdate);
        UserChars testUserChars = userCharsList.get(userCharsList.size() - 1);
        assertThat(testUserChars.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testUserChars.getMaxChars()).isEqualTo(UPDATED_MAX_CHARS);
        assertThat(testUserChars.getRemaningChars()).isEqualTo(DEFAULT_REMANING_CHARS);
    }

    @Test
    void fullUpdateUserCharsWithPatch() throws Exception {
        // Initialize the database
        userCharsRepository.save(userChars);

        int databaseSizeBeforeUpdate = userCharsRepository.findAll().size();

        // Update the userChars using partial update
        UserChars partialUpdatedUserChars = new UserChars();
        partialUpdatedUserChars.setId(userChars.getId());

        partialUpdatedUserChars.userId(UPDATED_USER_ID).maxChars(UPDATED_MAX_CHARS).remaningChars(UPDATED_REMANING_CHARS);

        restUserCharsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserChars.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserChars))
            )
            .andExpect(status().isOk());

        // Validate the UserChars in the database
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeUpdate);
        UserChars testUserChars = userCharsList.get(userCharsList.size() - 1);
        assertThat(testUserChars.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testUserChars.getMaxChars()).isEqualTo(UPDATED_MAX_CHARS);
        assertThat(testUserChars.getRemaningChars()).isEqualTo(UPDATED_REMANING_CHARS);
    }

    @Test
    void patchNonExistingUserChars() throws Exception {
        int databaseSizeBeforeUpdate = userCharsRepository.findAll().size();
        userChars.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserCharsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userChars.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userChars))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserChars in the database
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchUserChars() throws Exception {
        int databaseSizeBeforeUpdate = userCharsRepository.findAll().size();
        userChars.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserCharsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userChars))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserChars in the database
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamUserChars() throws Exception {
        int databaseSizeBeforeUpdate = userCharsRepository.findAll().size();
        userChars.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserCharsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userChars))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserChars in the database
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteUserChars() throws Exception {
        // Initialize the database
        userCharsRepository.save(userChars);

        int databaseSizeBeforeDelete = userCharsRepository.findAll().size();

        // Delete the userChars
        restUserCharsMockMvc
            .perform(delete(ENTITY_API_URL_ID, userChars.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserChars> userCharsList = userCharsRepository.findAll();
        assertThat(userCharsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
