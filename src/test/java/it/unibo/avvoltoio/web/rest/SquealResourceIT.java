package it.unibo.avvoltoio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import it.unibo.avvoltoio.IntegrationTest;
import it.unibo.avvoltoio.domain.Squeal;
import it.unibo.avvoltoio.repository.SquealRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link SquealResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SquealResourceIT {

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final Long DEFAULT_TIMESTAMP = 1L;
    private static final Long UPDATED_TIMESTAMP = 2L;

    private static final String DEFAULT_BODY = "AAAAAAAAAA";
    private static final String UPDATED_BODY = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMG = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMG = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMG_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMG_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_IMG_NAME = "AAAAAAAAAA";
    private static final String UPDATED_IMG_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_VIDEO_CONTENT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_VIDEO_CONTENT_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_VIDEO_NAME = "AAAAAAAAAA";
    private static final String UPDATED_VIDEO_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_N_CHARACTERS = 1;
    private static final Integer UPDATED_N_CHARACTERS = 2;

    private static final String DEFAULT_SQUEAL_ID_RESPONSE = "AAAAAAAAAA";
    private static final String UPDATED_SQUEAL_ID_RESPONSE = "BBBBBBBBBB";

    private static final Integer DEFAULT_REFRESH_TIME = 1;
    private static final Integer UPDATED_REFRESH_TIME = 2;

    private static final String ENTITY_API_URL = "/api/squeals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SquealRepository squealRepository;

    @Autowired
    private MockMvc restSquealMockMvc;

    private Squeal squeal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Squeal createEntity() {
        Squeal squeal = new Squeal()
            .userId(DEFAULT_USER_ID)
            .timestamp(DEFAULT_TIMESTAMP)
            .body(DEFAULT_BODY)
            .img(DEFAULT_IMG)
            .imgContentType(DEFAULT_IMG_CONTENT_TYPE)
            .imgName(DEFAULT_IMG_NAME)
            .videoContentType(DEFAULT_VIDEO_CONTENT_TYPE)
            .videoName(DEFAULT_VIDEO_NAME)
            .nCharacters(DEFAULT_N_CHARACTERS)
            .squealIdResponse(DEFAULT_SQUEAL_ID_RESPONSE)
            .refreshTime(DEFAULT_REFRESH_TIME);
        return squeal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Squeal createUpdatedEntity() {
        Squeal squeal = new Squeal()
            .userId(UPDATED_USER_ID)
            .timestamp(UPDATED_TIMESTAMP)
            .body(UPDATED_BODY)
            .img(UPDATED_IMG)
            .imgContentType(UPDATED_IMG_CONTENT_TYPE)
            .imgName(UPDATED_IMG_NAME)
            .videoContentType(UPDATED_VIDEO_CONTENT_TYPE)
            .videoName(UPDATED_VIDEO_NAME)
            .nCharacters(UPDATED_N_CHARACTERS)
            .squealIdResponse(UPDATED_SQUEAL_ID_RESPONSE)
            .refreshTime(UPDATED_REFRESH_TIME);
        return squeal;
    }

    @BeforeEach
    public void initTest() {
        squealRepository.deleteAll();
        squeal = createEntity();
    }

    @Test
    void createSqueal() throws Exception {
        int databaseSizeBeforeCreate = squealRepository.findAll().size();
        // Create the Squeal
        restSquealMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squeal)))
            .andExpect(status().isCreated());

        // Validate the Squeal in the database
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeCreate + 1);
        Squeal testSqueal = squealList.get(squealList.size() - 1);
        assertThat(testSqueal.getUser_id()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testSqueal.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testSqueal.getBody()).isEqualTo(DEFAULT_BODY);
        assertThat(testSqueal.getImg()).isEqualTo(DEFAULT_IMG);
        assertThat(testSqueal.getImg_content_type()).isEqualTo(DEFAULT_IMG_CONTENT_TYPE);
        assertThat(testSqueal.getImg_name()).isEqualTo(DEFAULT_IMG_NAME);
        assertThat(testSqueal.getVideo_content_type()).isEqualTo(DEFAULT_VIDEO_CONTENT_TYPE);
        assertThat(testSqueal.getVideo_name()).isEqualTo(DEFAULT_VIDEO_NAME);
        assertThat(testSqueal.getN_characters()).isEqualTo(DEFAULT_N_CHARACTERS);
        assertThat(testSqueal.getSqueal_id_response()).isEqualTo(DEFAULT_SQUEAL_ID_RESPONSE);
        assertThat(testSqueal.getRefresh_time()).isEqualTo(DEFAULT_REFRESH_TIME);
    }

    @Test
    void createSquealWithExistingId() throws Exception {
        // Create the Squeal with an existing ID
        squeal.setId("existing_id");

        int databaseSizeBeforeCreate = squealRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSquealMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squeal)))
            .andExpect(status().isBadRequest());

        // Validate the Squeal in the database
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllSqueals() throws Exception {
        // Initialize the database
        squealRepository.save(squeal);

        // Get all the squealList
        restSquealMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(squeal.getId())))
            .andExpect(jsonPath("$.[*].user_id").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.intValue())))
            .andExpect(jsonPath("$.[*].body").value(hasItem(DEFAULT_BODY)))
            .andExpect(jsonPath("$.[*].imgContentType").value(hasItem(DEFAULT_IMG_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].img").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMG))))
            .andExpect(jsonPath("$.[*].imgName").value(hasItem(DEFAULT_IMG_NAME)))
            .andExpect(jsonPath("$.[*].videoContentType").value(hasItem(DEFAULT_VIDEO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].videoName").value(hasItem(DEFAULT_VIDEO_NAME)))
            .andExpect(jsonPath("$.[*].nCharacters").value(hasItem(DEFAULT_N_CHARACTERS)))
            .andExpect(jsonPath("$.[*].squealIdResponse").value(hasItem(DEFAULT_SQUEAL_ID_RESPONSE)))
            .andExpect(jsonPath("$.[*].refreshTime").value(hasItem(DEFAULT_REFRESH_TIME)));
    }

    @Test
    void getSqueal() throws Exception {
        // Initialize the database
        squealRepository.save(squeal);

        // Get the squeal
        restSquealMockMvc
            .perform(get(ENTITY_API_URL_ID, squeal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(squeal.getId()))
            .andExpect(jsonPath("$.user_id").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.intValue()))
            .andExpect(jsonPath("$.body").value(DEFAULT_BODY))
            .andExpect(jsonPath("$.imgContentType").value(DEFAULT_IMG_CONTENT_TYPE))
            .andExpect(jsonPath("$.img").value(Base64Utils.encodeToString(DEFAULT_IMG)))
            .andExpect(jsonPath("$.imgName").value(DEFAULT_IMG_NAME))
            .andExpect(jsonPath("$.videoContentType").value(DEFAULT_VIDEO_CONTENT_TYPE))
            .andExpect(jsonPath("$.videoName").value(DEFAULT_VIDEO_NAME))
            .andExpect(jsonPath("$.nCharacters").value(DEFAULT_N_CHARACTERS))
            .andExpect(jsonPath("$.squealIdResponse").value(DEFAULT_SQUEAL_ID_RESPONSE))
            .andExpect(jsonPath("$.refreshTime").value(DEFAULT_REFRESH_TIME));
    }

    @Test
    void getNonExistingSqueal() throws Exception {
        // Get the squeal
        restSquealMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingSqueal() throws Exception {
        // Initialize the database
        squealRepository.save(squeal);

        int databaseSizeBeforeUpdate = squealRepository.findAll().size();

        // Update the squeal
        Squeal updatedSqueal = squealRepository.findById(squeal.getId()).orElseThrow();
        updatedSqueal
            .userId(UPDATED_USER_ID)
            .timestamp(UPDATED_TIMESTAMP)
            .body(UPDATED_BODY)
            .img(UPDATED_IMG)
            .imgContentType(UPDATED_IMG_CONTENT_TYPE)
            .imgName(UPDATED_IMG_NAME)
            .videoContentType(UPDATED_VIDEO_CONTENT_TYPE)
            .videoName(UPDATED_VIDEO_NAME)
            .nCharacters(UPDATED_N_CHARACTERS)
            .squealIdResponse(UPDATED_SQUEAL_ID_RESPONSE)
            .refreshTime(UPDATED_REFRESH_TIME);

        restSquealMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSqueal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSqueal))
            )
            .andExpect(status().isOk());

        // Validate the Squeal in the database
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeUpdate);
        Squeal testSqueal = squealList.get(squealList.size() - 1);
        assertThat(testSqueal.getUser_id()).isEqualTo(UPDATED_USER_ID);
        assertThat(testSqueal.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testSqueal.getBody()).isEqualTo(UPDATED_BODY);
        assertThat(testSqueal.getImg()).isEqualTo(UPDATED_IMG);
        assertThat(testSqueal.getImg_content_type()).isEqualTo(UPDATED_IMG_CONTENT_TYPE);
        assertThat(testSqueal.getImg_name()).isEqualTo(UPDATED_IMG_NAME);
        assertThat(testSqueal.getVideo_content_type()).isEqualTo(UPDATED_VIDEO_CONTENT_TYPE);
        assertThat(testSqueal.getVideo_name()).isEqualTo(UPDATED_VIDEO_NAME);
        assertThat(testSqueal.getN_characters()).isEqualTo(UPDATED_N_CHARACTERS);
        assertThat(testSqueal.getSqueal_id_response()).isEqualTo(UPDATED_SQUEAL_ID_RESPONSE);
        assertThat(testSqueal.getRefresh_time()).isEqualTo(UPDATED_REFRESH_TIME);
    }

    @Test
    void putNonExistingSqueal() throws Exception {
        int databaseSizeBeforeUpdate = squealRepository.findAll().size();
        squeal.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSquealMockMvc
            .perform(
                put(ENTITY_API_URL_ID, squeal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(squeal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Squeal in the database
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSqueal() throws Exception {
        int databaseSizeBeforeUpdate = squealRepository.findAll().size();
        squeal.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(squeal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Squeal in the database
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSqueal() throws Exception {
        int databaseSizeBeforeUpdate = squealRepository.findAll().size();
        squeal.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squeal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Squeal in the database
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSquealWithPatch() throws Exception {
        // Initialize the database
        squealRepository.save(squeal);

        int databaseSizeBeforeUpdate = squealRepository.findAll().size();

        // Update the squeal using partial update
        Squeal partialUpdatedSqueal = new Squeal();
        partialUpdatedSqueal.setId(squeal.getId());

        partialUpdatedSqueal
            .userId(UPDATED_USER_ID)
            .img(UPDATED_IMG)
            .imgContentType(UPDATED_IMG_CONTENT_TYPE)
            .imgName(UPDATED_IMG_NAME)
            .videoContentType(UPDATED_VIDEO_CONTENT_TYPE);

        restSquealMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSqueal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSqueal))
            )
            .andExpect(status().isOk());

        // Validate the Squeal in the database
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeUpdate);
        Squeal testSqueal = squealList.get(squealList.size() - 1);
        assertThat(testSqueal.getUser_id()).isEqualTo(UPDATED_USER_ID);
        assertThat(testSqueal.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testSqueal.getBody()).isEqualTo(DEFAULT_BODY);
        assertThat(testSqueal.getImg()).isEqualTo(UPDATED_IMG);
        assertThat(testSqueal.getImg_content_type()).isEqualTo(UPDATED_IMG_CONTENT_TYPE);
        assertThat(testSqueal.getImg_name()).isEqualTo(UPDATED_IMG_NAME);
        assertThat(testSqueal.getVideo_content_type()).isEqualTo(UPDATED_VIDEO_CONTENT_TYPE);
        assertThat(testSqueal.getVideo_name()).isEqualTo(DEFAULT_VIDEO_NAME);
        assertThat(testSqueal.getN_characters()).isEqualTo(DEFAULT_N_CHARACTERS);
        assertThat(testSqueal.getSqueal_id_response()).isEqualTo(DEFAULT_SQUEAL_ID_RESPONSE);
        assertThat(testSqueal.getRefresh_time()).isEqualTo(DEFAULT_REFRESH_TIME);
    }

    @Test
    void fullUpdateSquealWithPatch() throws Exception {
        // Initialize the database
        squealRepository.save(squeal);

        int databaseSizeBeforeUpdate = squealRepository.findAll().size();

        // Update the squeal using partial update
        Squeal partialUpdatedSqueal = new Squeal();
        partialUpdatedSqueal.setId(squeal.getId());

        partialUpdatedSqueal
            .userId(UPDATED_USER_ID)
            .timestamp(UPDATED_TIMESTAMP)
            .body(UPDATED_BODY)
            .img(UPDATED_IMG)
            .imgContentType(UPDATED_IMG_CONTENT_TYPE)
            .imgName(UPDATED_IMG_NAME)
            .videoContentType(UPDATED_VIDEO_CONTENT_TYPE)
            .videoName(UPDATED_VIDEO_NAME)
            .nCharacters(UPDATED_N_CHARACTERS)
            .squealIdResponse(UPDATED_SQUEAL_ID_RESPONSE)
            .refreshTime(UPDATED_REFRESH_TIME);

        restSquealMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSqueal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSqueal))
            )
            .andExpect(status().isOk());

        // Validate the Squeal in the database
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeUpdate);
        Squeal testSqueal = squealList.get(squealList.size() - 1);
        assertThat(testSqueal.getUser_id()).isEqualTo(UPDATED_USER_ID);
        assertThat(testSqueal.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testSqueal.getBody()).isEqualTo(UPDATED_BODY);
        assertThat(testSqueal.getImg()).isEqualTo(UPDATED_IMG);
        assertThat(testSqueal.getImg_content_type()).isEqualTo(UPDATED_IMG_CONTENT_TYPE);
        assertThat(testSqueal.getImg_name()).isEqualTo(UPDATED_IMG_NAME);
        assertThat(testSqueal.getVideo_content_type()).isEqualTo(UPDATED_VIDEO_CONTENT_TYPE);
        assertThat(testSqueal.getVideo_name()).isEqualTo(UPDATED_VIDEO_NAME);
        assertThat(testSqueal.getN_characters()).isEqualTo(UPDATED_N_CHARACTERS);
        assertThat(testSqueal.getSqueal_id_response()).isEqualTo(UPDATED_SQUEAL_ID_RESPONSE);
        assertThat(testSqueal.getRefresh_time()).isEqualTo(UPDATED_REFRESH_TIME);
    }

    @Test
    void patchNonExistingSqueal() throws Exception {
        int databaseSizeBeforeUpdate = squealRepository.findAll().size();
        squeal.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSquealMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, squeal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(squeal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Squeal in the database
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSqueal() throws Exception {
        int databaseSizeBeforeUpdate = squealRepository.findAll().size();
        squeal.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(squeal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Squeal in the database
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSqueal() throws Exception {
        int databaseSizeBeforeUpdate = squealRepository.findAll().size();
        squeal.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquealMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(squeal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Squeal in the database
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSqueal() throws Exception {
        // Initialize the database
        squealRepository.save(squeal);

        int databaseSizeBeforeDelete = squealRepository.findAll().size();

        // Delete the squeal
        restSquealMockMvc
            .perform(delete(ENTITY_API_URL_ID, squeal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Squeal> squealList = squealRepository.findAll();
        assertThat(squealList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
