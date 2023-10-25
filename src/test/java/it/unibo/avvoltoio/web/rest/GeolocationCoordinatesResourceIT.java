package it.unibo.avvoltoio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import it.unibo.avvoltoio.IntegrationTest;
import it.unibo.avvoltoio.domain.GeolocationCoordinates;
import it.unibo.avvoltoio.repository.GeolocationCoordinatesRepository;
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
 * Integration tests for the {@link GeolocationCoordinatesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GeolocationCoordinatesResourceIT {

    private static final String DEFAULT_SQUEAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_SQUEAL_ID = "BBBBBBBBBB";

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final Double DEFAULT_ACCURACY = 1D;
    private static final Double UPDATED_ACCURACY = 2D;

    private static final Double DEFAULT_HEADING = 1D;
    private static final Double UPDATED_HEADING = 2D;

    private static final Double DEFAULT_SPEED = 1D;
    private static final Double UPDATED_SPEED = 2D;

    private static final Long DEFAULT_TIMESTAMP = 1L;
    private static final Long UPDATED_TIMESTAMP = 2L;

    private static final String ENTITY_API_URL = "/api/geolocation-coordinates";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private GeolocationCoordinatesRepository geolocationCoordinatesRepository;

    @Autowired
    private MockMvc restGeolocationCoordinatesMockMvc;

    private GeolocationCoordinates geolocationCoordinates;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GeolocationCoordinates createEntity() {
        GeolocationCoordinates geolocationCoordinates = new GeolocationCoordinates()
            .squealId(DEFAULT_SQUEAL_ID)
            .userId(DEFAULT_USER_ID)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE)
            .accuracy(DEFAULT_ACCURACY)
            .heading(DEFAULT_HEADING)
            .speed(DEFAULT_SPEED)
            .timestamp(DEFAULT_TIMESTAMP);
        return geolocationCoordinates;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GeolocationCoordinates createUpdatedEntity() {
        GeolocationCoordinates geolocationCoordinates = new GeolocationCoordinates()
            .squealId(UPDATED_SQUEAL_ID)
            .userId(UPDATED_USER_ID)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .accuracy(UPDATED_ACCURACY)
            .heading(UPDATED_HEADING)
            .speed(UPDATED_SPEED)
            .timestamp(UPDATED_TIMESTAMP);
        return geolocationCoordinates;
    }

    @BeforeEach
    public void initTest() {
        geolocationCoordinatesRepository.deleteAll();
        geolocationCoordinates = createEntity();
    }

    @Test
    void createGeolocationCoordinates() throws Exception {
        int databaseSizeBeforeCreate = geolocationCoordinatesRepository.findAll().size();
        // Create the GeolocationCoordinates
        restGeolocationCoordinatesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(geolocationCoordinates))
            )
            .andExpect(status().isCreated());

        // Validate the GeolocationCoordinates in the database
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeCreate + 1);
        GeolocationCoordinates testGeolocationCoordinates = geolocationCoordinatesList.get(geolocationCoordinatesList.size() - 1);
        assertThat(testGeolocationCoordinates.getSqueal_id()).isEqualTo(DEFAULT_SQUEAL_ID);
        assertThat(testGeolocationCoordinates.getUser_id()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testGeolocationCoordinates.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testGeolocationCoordinates.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testGeolocationCoordinates.getAccuracy()).isEqualTo(DEFAULT_ACCURACY);
        assertThat(testGeolocationCoordinates.getHeading()).isEqualTo(DEFAULT_HEADING);
        assertThat(testGeolocationCoordinates.getSpeed()).isEqualTo(DEFAULT_SPEED);
        assertThat(testGeolocationCoordinates.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    void createGeolocationCoordinatesWithExistingId() throws Exception {
        // Create the GeolocationCoordinates with an existing ID
        geolocationCoordinates.setId("existing_id");

        int databaseSizeBeforeCreate = geolocationCoordinatesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGeolocationCoordinatesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(geolocationCoordinates))
            )
            .andExpect(status().isBadRequest());

        // Validate the GeolocationCoordinates in the database
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllGeolocationCoordinates() throws Exception {
        // Initialize the database
        geolocationCoordinatesRepository.save(geolocationCoordinates);

        // Get all the geolocationCoordinatesList
        restGeolocationCoordinatesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(geolocationCoordinates.getId())))
            .andExpect(jsonPath("$.[*].squealId").value(hasItem(DEFAULT_SQUEAL_ID)))
            .andExpect(jsonPath("$.[*].user_id").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].accuracy").value(hasItem(DEFAULT_ACCURACY.doubleValue())))
            .andExpect(jsonPath("$.[*].heading").value(hasItem(DEFAULT_HEADING.doubleValue())))
            .andExpect(jsonPath("$.[*].speed").value(hasItem(DEFAULT_SPEED.doubleValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.intValue())));
    }

    @Test
    void getGeolocationCoordinates() throws Exception {
        // Initialize the database
        geolocationCoordinatesRepository.save(geolocationCoordinates);

        // Get the geolocationCoordinates
        restGeolocationCoordinatesMockMvc
            .perform(get(ENTITY_API_URL_ID, geolocationCoordinates.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(geolocationCoordinates.getId()))
            .andExpect(jsonPath("$.squealId").value(DEFAULT_SQUEAL_ID))
            .andExpect(jsonPath("$.user_id").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()))
            .andExpect(jsonPath("$.accuracy").value(DEFAULT_ACCURACY.doubleValue()))
            .andExpect(jsonPath("$.heading").value(DEFAULT_HEADING.doubleValue()))
            .andExpect(jsonPath("$.speed").value(DEFAULT_SPEED.doubleValue()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.intValue()));
    }

    @Test
    void getNonExistingGeolocationCoordinates() throws Exception {
        // Get the geolocationCoordinates
        restGeolocationCoordinatesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingGeolocationCoordinates() throws Exception {
        // Initialize the database
        geolocationCoordinatesRepository.save(geolocationCoordinates);

        int databaseSizeBeforeUpdate = geolocationCoordinatesRepository.findAll().size();

        // Update the geolocationCoordinates
        GeolocationCoordinates updatedGeolocationCoordinates = geolocationCoordinatesRepository
            .findById(geolocationCoordinates.getId())
            .orElseThrow();
        updatedGeolocationCoordinates
            .squealId(UPDATED_SQUEAL_ID)
            .userId(UPDATED_USER_ID)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .accuracy(UPDATED_ACCURACY)
            .heading(UPDATED_HEADING)
            .speed(UPDATED_SPEED)
            .timestamp(UPDATED_TIMESTAMP);

        restGeolocationCoordinatesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGeolocationCoordinates.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGeolocationCoordinates))
            )
            .andExpect(status().isOk());

        // Validate the GeolocationCoordinates in the database
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeUpdate);
        GeolocationCoordinates testGeolocationCoordinates = geolocationCoordinatesList.get(geolocationCoordinatesList.size() - 1);
        assertThat(testGeolocationCoordinates.getSqueal_id()).isEqualTo(UPDATED_SQUEAL_ID);
        assertThat(testGeolocationCoordinates.getUser_id()).isEqualTo(UPDATED_USER_ID);
        assertThat(testGeolocationCoordinates.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testGeolocationCoordinates.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testGeolocationCoordinates.getAccuracy()).isEqualTo(UPDATED_ACCURACY);
        assertThat(testGeolocationCoordinates.getHeading()).isEqualTo(UPDATED_HEADING);
        assertThat(testGeolocationCoordinates.getSpeed()).isEqualTo(UPDATED_SPEED);
        assertThat(testGeolocationCoordinates.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    void putNonExistingGeolocationCoordinates() throws Exception {
        int databaseSizeBeforeUpdate = geolocationCoordinatesRepository.findAll().size();
        geolocationCoordinates.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGeolocationCoordinatesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, geolocationCoordinates.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(geolocationCoordinates))
            )
            .andExpect(status().isBadRequest());

        // Validate the GeolocationCoordinates in the database
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchGeolocationCoordinates() throws Exception {
        int databaseSizeBeforeUpdate = geolocationCoordinatesRepository.findAll().size();
        geolocationCoordinates.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeolocationCoordinatesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(geolocationCoordinates))
            )
            .andExpect(status().isBadRequest());

        // Validate the GeolocationCoordinates in the database
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamGeolocationCoordinates() throws Exception {
        int databaseSizeBeforeUpdate = geolocationCoordinatesRepository.findAll().size();
        geolocationCoordinates.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeolocationCoordinatesMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(geolocationCoordinates))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GeolocationCoordinates in the database
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateGeolocationCoordinatesWithPatch() throws Exception {
        // Initialize the database
        geolocationCoordinatesRepository.save(geolocationCoordinates);

        int databaseSizeBeforeUpdate = geolocationCoordinatesRepository.findAll().size();

        // Update the geolocationCoordinates using partial update
        GeolocationCoordinates partialUpdatedGeolocationCoordinates = new GeolocationCoordinates();
        partialUpdatedGeolocationCoordinates.setId(geolocationCoordinates.getId());

        partialUpdatedGeolocationCoordinates
            .squealId(UPDATED_SQUEAL_ID)
            .userId(UPDATED_USER_ID)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .accuracy(UPDATED_ACCURACY)
            .heading(UPDATED_HEADING)
            .speed(UPDATED_SPEED)
            .timestamp(UPDATED_TIMESTAMP);

        restGeolocationCoordinatesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGeolocationCoordinates.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGeolocationCoordinates))
            )
            .andExpect(status().isOk());

        // Validate the GeolocationCoordinates in the database
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeUpdate);
        GeolocationCoordinates testGeolocationCoordinates = geolocationCoordinatesList.get(geolocationCoordinatesList.size() - 1);
        assertThat(testGeolocationCoordinates.getSqueal_id()).isEqualTo(UPDATED_SQUEAL_ID);
        assertThat(testGeolocationCoordinates.getUser_id()).isEqualTo(UPDATED_USER_ID);
        assertThat(testGeolocationCoordinates.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testGeolocationCoordinates.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testGeolocationCoordinates.getAccuracy()).isEqualTo(UPDATED_ACCURACY);
        assertThat(testGeolocationCoordinates.getHeading()).isEqualTo(UPDATED_HEADING);
        assertThat(testGeolocationCoordinates.getSpeed()).isEqualTo(UPDATED_SPEED);
        assertThat(testGeolocationCoordinates.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    void fullUpdateGeolocationCoordinatesWithPatch() throws Exception {
        // Initialize the database
        geolocationCoordinatesRepository.save(geolocationCoordinates);

        int databaseSizeBeforeUpdate = geolocationCoordinatesRepository.findAll().size();

        // Update the geolocationCoordinates using partial update
        GeolocationCoordinates partialUpdatedGeolocationCoordinates = new GeolocationCoordinates();
        partialUpdatedGeolocationCoordinates.setId(geolocationCoordinates.getId());

        partialUpdatedGeolocationCoordinates
            .squealId(UPDATED_SQUEAL_ID)
            .userId(UPDATED_USER_ID)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .accuracy(UPDATED_ACCURACY)
            .heading(UPDATED_HEADING)
            .speed(UPDATED_SPEED)
            .timestamp(UPDATED_TIMESTAMP);

        restGeolocationCoordinatesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGeolocationCoordinates.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGeolocationCoordinates))
            )
            .andExpect(status().isOk());

        // Validate the GeolocationCoordinates in the database
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeUpdate);
        GeolocationCoordinates testGeolocationCoordinates = geolocationCoordinatesList.get(geolocationCoordinatesList.size() - 1);
        assertThat(testGeolocationCoordinates.getSqueal_id()).isEqualTo(UPDATED_SQUEAL_ID);
        assertThat(testGeolocationCoordinates.getUser_id()).isEqualTo(UPDATED_USER_ID);
        assertThat(testGeolocationCoordinates.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testGeolocationCoordinates.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testGeolocationCoordinates.getAccuracy()).isEqualTo(UPDATED_ACCURACY);
        assertThat(testGeolocationCoordinates.getHeading()).isEqualTo(UPDATED_HEADING);
        assertThat(testGeolocationCoordinates.getSpeed()).isEqualTo(UPDATED_SPEED);
        assertThat(testGeolocationCoordinates.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    void patchNonExistingGeolocationCoordinates() throws Exception {
        int databaseSizeBeforeUpdate = geolocationCoordinatesRepository.findAll().size();
        geolocationCoordinates.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGeolocationCoordinatesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, geolocationCoordinates.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(geolocationCoordinates))
            )
            .andExpect(status().isBadRequest());

        // Validate the GeolocationCoordinates in the database
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchGeolocationCoordinates() throws Exception {
        int databaseSizeBeforeUpdate = geolocationCoordinatesRepository.findAll().size();
        geolocationCoordinates.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeolocationCoordinatesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(geolocationCoordinates))
            )
            .andExpect(status().isBadRequest());

        // Validate the GeolocationCoordinates in the database
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamGeolocationCoordinates() throws Exception {
        int databaseSizeBeforeUpdate = geolocationCoordinatesRepository.findAll().size();
        geolocationCoordinates.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeolocationCoordinatesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(geolocationCoordinates))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GeolocationCoordinates in the database
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteGeolocationCoordinates() throws Exception {
        // Initialize the database
        geolocationCoordinatesRepository.save(geolocationCoordinates);

        int databaseSizeBeforeDelete = geolocationCoordinatesRepository.findAll().size();

        // Delete the geolocationCoordinates
        restGeolocationCoordinatesMockMvc
            .perform(delete(ENTITY_API_URL_ID, geolocationCoordinates.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GeolocationCoordinates> geolocationCoordinatesList = geolocationCoordinatesRepository.findAll();
        assertThat(geolocationCoordinatesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
