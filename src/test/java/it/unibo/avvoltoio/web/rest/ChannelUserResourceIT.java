package it.unibo.avvoltoio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import it.unibo.avvoltoio.IntegrationTest;
import it.unibo.avvoltoio.domain.ChannelUser;
import it.unibo.avvoltoio.domain.enumeration.PrivilegeType;
import it.unibo.avvoltoio.repository.ChannelUserRepository;
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
 * Integration tests for the {@link ChannelUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChannelUserResourceIT {

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final String DEFAULT_CHANNEL_ID = "AAAAAAAAAA";
    private static final String UPDATED_CHANNEL_ID = "BBBBBBBBBB";

    private static final PrivilegeType DEFAULT_PRIVILEGE = PrivilegeType.ADMIN;
    private static final PrivilegeType UPDATED_PRIVILEGE = PrivilegeType.WRITE;

    private static final String ENTITY_API_URL = "/api/channel-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ChannelUserRepository channelUserRepository;

    @Autowired
    private MockMvc restChannelUserMockMvc;

    private ChannelUser channelUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChannelUser createEntity() {
        ChannelUser channelUser = new ChannelUser().userId(DEFAULT_USER_ID).channelId(DEFAULT_CHANNEL_ID).privilege(DEFAULT_PRIVILEGE);
        return channelUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChannelUser createUpdatedEntity() {
        ChannelUser channelUser = new ChannelUser().userId(UPDATED_USER_ID).channelId(UPDATED_CHANNEL_ID).privilege(UPDATED_PRIVILEGE);
        return channelUser;
    }

    @BeforeEach
    public void initTest() {
        channelUserRepository.deleteAll();
        channelUser = createEntity();
    }

    @Test
    void createChannelUser() throws Exception {
        int databaseSizeBeforeCreate = channelUserRepository.findAll().size();
        // Create the ChannelUser
        restChannelUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(channelUser)))
            .andExpect(status().isCreated());

        // Validate the ChannelUser in the database
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeCreate + 1);
        ChannelUser testChannelUser = channelUserList.get(channelUserList.size() - 1);
        assertThat(testChannelUser.getUser_id()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testChannelUser.getChannel_id()).isEqualTo(DEFAULT_CHANNEL_ID);
        assertThat(testChannelUser.getPrivilege()).isEqualTo(DEFAULT_PRIVILEGE);
    }

    @Test
    void createChannelUserWithExistingId() throws Exception {
        // Create the ChannelUser with an existing ID
        channelUser.setId("existing_id");

        int databaseSizeBeforeCreate = channelUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChannelUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(channelUser)))
            .andExpect(status().isBadRequest());

        // Validate the ChannelUser in the database
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllChannelUsers() throws Exception {
        // Initialize the database
        channelUserRepository.save(channelUser);

        // Get all the channelUserList
        restChannelUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(channelUser.getId())))
            .andExpect(jsonPath("$.[*].user_id").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].channelId").value(hasItem(DEFAULT_CHANNEL_ID)))
            .andExpect(jsonPath("$.[*].privilege").value(hasItem(DEFAULT_PRIVILEGE.toString())));
    }

    @Test
    void getChannelUser() throws Exception {
        // Initialize the database
        channelUserRepository.save(channelUser);

        // Get the channelUser
        restChannelUserMockMvc
            .perform(get(ENTITY_API_URL_ID, channelUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(channelUser.getId()))
            .andExpect(jsonPath("$.user_id").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.channelId").value(DEFAULT_CHANNEL_ID))
            .andExpect(jsonPath("$.privilege").value(DEFAULT_PRIVILEGE.toString()));
    }

    @Test
    void getNonExistingChannelUser() throws Exception {
        // Get the channelUser
        restChannelUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingChannelUser() throws Exception {
        // Initialize the database
        channelUserRepository.save(channelUser);

        int databaseSizeBeforeUpdate = channelUserRepository.findAll().size();

        // Update the channelUser
        ChannelUser updatedChannelUser = channelUserRepository.findById(channelUser.getId()).orElseThrow();
        updatedChannelUser.userId(UPDATED_USER_ID).channelId(UPDATED_CHANNEL_ID).privilege(UPDATED_PRIVILEGE);

        restChannelUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChannelUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChannelUser))
            )
            .andExpect(status().isOk());

        // Validate the ChannelUser in the database
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeUpdate);
        ChannelUser testChannelUser = channelUserList.get(channelUserList.size() - 1);
        assertThat(testChannelUser.getUser_id()).isEqualTo(UPDATED_USER_ID);
        assertThat(testChannelUser.getChannel_id()).isEqualTo(UPDATED_CHANNEL_ID);
        assertThat(testChannelUser.getPrivilege()).isEqualTo(UPDATED_PRIVILEGE);
    }

    @Test
    void putNonExistingChannelUser() throws Exception {
        int databaseSizeBeforeUpdate = channelUserRepository.findAll().size();
        channelUser.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChannelUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, channelUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(channelUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChannelUser in the database
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchChannelUser() throws Exception {
        int databaseSizeBeforeUpdate = channelUserRepository.findAll().size();
        channelUser.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChannelUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(channelUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChannelUser in the database
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamChannelUser() throws Exception {
        int databaseSizeBeforeUpdate = channelUserRepository.findAll().size();
        channelUser.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChannelUserMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(channelUser)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChannelUser in the database
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateChannelUserWithPatch() throws Exception {
        // Initialize the database
        channelUserRepository.save(channelUser);

        int databaseSizeBeforeUpdate = channelUserRepository.findAll().size();

        // Update the channelUser using partial update
        ChannelUser partialUpdatedChannelUser = new ChannelUser();
        partialUpdatedChannelUser.setId(channelUser.getId());

        restChannelUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChannelUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChannelUser))
            )
            .andExpect(status().isOk());

        // Validate the ChannelUser in the database
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeUpdate);
        ChannelUser testChannelUser = channelUserList.get(channelUserList.size() - 1);
        assertThat(testChannelUser.getUser_id()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testChannelUser.getChannel_id()).isEqualTo(DEFAULT_CHANNEL_ID);
        assertThat(testChannelUser.getPrivilege()).isEqualTo(DEFAULT_PRIVILEGE);
    }

    @Test
    void fullUpdateChannelUserWithPatch() throws Exception {
        // Initialize the database
        channelUserRepository.save(channelUser);

        int databaseSizeBeforeUpdate = channelUserRepository.findAll().size();

        // Update the channelUser using partial update
        ChannelUser partialUpdatedChannelUser = new ChannelUser();
        partialUpdatedChannelUser.setId(channelUser.getId());

        partialUpdatedChannelUser.userId(UPDATED_USER_ID).channelId(UPDATED_CHANNEL_ID).privilege(UPDATED_PRIVILEGE);

        restChannelUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChannelUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChannelUser))
            )
            .andExpect(status().isOk());

        // Validate the ChannelUser in the database
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeUpdate);
        ChannelUser testChannelUser = channelUserList.get(channelUserList.size() - 1);
        assertThat(testChannelUser.getUser_id()).isEqualTo(UPDATED_USER_ID);
        assertThat(testChannelUser.getChannel_id()).isEqualTo(UPDATED_CHANNEL_ID);
        assertThat(testChannelUser.getPrivilege()).isEqualTo(UPDATED_PRIVILEGE);
    }

    @Test
    void patchNonExistingChannelUser() throws Exception {
        int databaseSizeBeforeUpdate = channelUserRepository.findAll().size();
        channelUser.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChannelUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, channelUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(channelUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChannelUser in the database
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchChannelUser() throws Exception {
        int databaseSizeBeforeUpdate = channelUserRepository.findAll().size();
        channelUser.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChannelUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(channelUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChannelUser in the database
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamChannelUser() throws Exception {
        int databaseSizeBeforeUpdate = channelUserRepository.findAll().size();
        channelUser.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChannelUserMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(channelUser))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChannelUser in the database
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteChannelUser() throws Exception {
        // Initialize the database
        channelUserRepository.save(channelUser);

        int databaseSizeBeforeDelete = channelUserRepository.findAll().size();

        // Delete the channelUser
        restChannelUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, channelUser.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChannelUser> channelUserList = channelUserRepository.findAll();
        assertThat(channelUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
