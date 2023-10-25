package it.unibo.avvoltoio.web.rest;

import it.unibo.avvoltoio.domain.GeolocationCoordinates;
import it.unibo.avvoltoio.repository.GeolocationCoordinatesRepository;
import it.unibo.avvoltoio.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link it.unibo.avvoltoio.domain.GeolocationCoordinates}.
 */
@RestController
@RequestMapping("/api")
public class GeolocationCoordinatesResource {

    private final Logger log = LoggerFactory.getLogger(GeolocationCoordinatesResource.class);

    private static final String ENTITY_NAME = "geolocationCoordinates";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GeolocationCoordinatesRepository geolocationCoordinatesRepository;

    public GeolocationCoordinatesResource(GeolocationCoordinatesRepository geolocationCoordinatesRepository) {
        this.geolocationCoordinatesRepository = geolocationCoordinatesRepository;
    }

    /**
     * {@code POST  /geolocation-coordinates} : Create a new geolocationCoordinates.
     *
     * @param geolocationCoordinates the geolocationCoordinates to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new geolocationCoordinates, or with status {@code 400 (Bad Request)} if the geolocationCoordinates has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/geolocation-coordinates")
    public ResponseEntity<GeolocationCoordinates> createGeolocationCoordinates(@RequestBody GeolocationCoordinates geolocationCoordinates)
        throws URISyntaxException {
        log.debug("REST request to save GeolocationCoordinates : {}", geolocationCoordinates);
        if (geolocationCoordinates.getId() != null) {
            throw new BadRequestAlertException("A new geolocationCoordinates cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GeolocationCoordinates result = geolocationCoordinatesRepository.save(geolocationCoordinates);
        return ResponseEntity
            .created(new URI("/api/geolocation-coordinates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /geolocation-coordinates/:id} : Updates an existing geolocationCoordinates.
     *
     * @param id the id of the geolocationCoordinates to save.
     * @param geolocationCoordinates the geolocationCoordinates to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated geolocationCoordinates,
     * or with status {@code 400 (Bad Request)} if the geolocationCoordinates is not valid,
     * or with status {@code 500 (Internal Server Error)} if the geolocationCoordinates couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/geolocation-coordinates/{id}")
    public ResponseEntity<GeolocationCoordinates> updateGeolocationCoordinates(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody GeolocationCoordinates geolocationCoordinates
    ) throws URISyntaxException {
        log.debug("REST request to update GeolocationCoordinates : {}, {}", id, geolocationCoordinates);
        if (geolocationCoordinates.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, geolocationCoordinates.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!geolocationCoordinatesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GeolocationCoordinates result = geolocationCoordinatesRepository.save(geolocationCoordinates);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, geolocationCoordinates.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /geolocation-coordinates/:id} : Partial updates given fields of an existing geolocationCoordinates, field will ignore if it is null
     *
     * @param id the id of the geolocationCoordinates to save.
     * @param geolocationCoordinates the geolocationCoordinates to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated geolocationCoordinates,
     * or with status {@code 400 (Bad Request)} if the geolocationCoordinates is not valid,
     * or with status {@code 404 (Not Found)} if the geolocationCoordinates is not found,
     * or with status {@code 500 (Internal Server Error)} if the geolocationCoordinates couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/geolocation-coordinates/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GeolocationCoordinates> partialUpdateGeolocationCoordinates(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody GeolocationCoordinates geolocationCoordinates
    ) throws URISyntaxException {
        log.debug("REST request to partial update GeolocationCoordinates partially : {}, {}", id, geolocationCoordinates);
        if (geolocationCoordinates.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, geolocationCoordinates.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!geolocationCoordinatesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GeolocationCoordinates> result = geolocationCoordinatesRepository
            .findById(geolocationCoordinates.getId())
            .map(existingGeolocationCoordinates -> {
                if (geolocationCoordinates.getSqueal_id() != null) {
                    existingGeolocationCoordinates.setSqueal_id(geolocationCoordinates.getSqueal_id());
                }
                if (geolocationCoordinates.getUser_id() != null) {
                    existingGeolocationCoordinates.setUser_id(geolocationCoordinates.getUser_id());
                }
                if (geolocationCoordinates.getLatitude() != null) {
                    existingGeolocationCoordinates.setLatitude(geolocationCoordinates.getLatitude());
                }
                if (geolocationCoordinates.getLongitude() != null) {
                    existingGeolocationCoordinates.setLongitude(geolocationCoordinates.getLongitude());
                }
                if (geolocationCoordinates.getAccuracy() != null) {
                    existingGeolocationCoordinates.setAccuracy(geolocationCoordinates.getAccuracy());
                }
                if (geolocationCoordinates.getHeading() != null) {
                    existingGeolocationCoordinates.setHeading(geolocationCoordinates.getHeading());
                }
                if (geolocationCoordinates.getSpeed() != null) {
                    existingGeolocationCoordinates.setSpeed(geolocationCoordinates.getSpeed());
                }
                if (geolocationCoordinates.getTimestamp() != null) {
                    existingGeolocationCoordinates.setTimestamp(geolocationCoordinates.getTimestamp());
                }

                return existingGeolocationCoordinates;
            })
            .map(geolocationCoordinatesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, geolocationCoordinates.getId())
        );
    }

    /**
     * {@code GET  /geolocation-coordinates} : get all the geolocationCoordinates.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of geolocationCoordinates in body.
     */
    @GetMapping("/geolocation-coordinates")
    public List<GeolocationCoordinates> getAllGeolocationCoordinates() {
        log.debug("REST request to get all GeolocationCoordinates");
        return geolocationCoordinatesRepository.findAll();
    }

    /**
     * {@code GET  /geolocation-coordinates/:id} : get the "id" geolocationCoordinates.
     *
     * @param id the id of the geolocationCoordinates to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the geolocationCoordinates, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/geolocation-coordinates/{id}")
    public ResponseEntity<GeolocationCoordinates> getGeolocationCoordinates(@PathVariable String id) {
        log.debug("REST request to get GeolocationCoordinates : {}", id);
        Optional<GeolocationCoordinates> geolocationCoordinates = geolocationCoordinatesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(geolocationCoordinates);
    }

    /**
     * {@code DELETE  /geolocation-coordinates/:id} : delete the "id" geolocationCoordinates.
     *
     * @param id the id of the geolocationCoordinates to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/geolocation-coordinates/{id}")
    public ResponseEntity<Void> deleteGeolocationCoordinates(@PathVariable String id) {
        log.debug("REST request to delete GeolocationCoordinates : {}", id);
        geolocationCoordinatesRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }
}
