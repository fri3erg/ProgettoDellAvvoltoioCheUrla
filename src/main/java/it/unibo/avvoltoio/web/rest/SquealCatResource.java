package it.unibo.avvoltoio.web.rest;

import it.unibo.avvoltoio.domain.SquealCat;
import it.unibo.avvoltoio.repository.SquealCatRepository;
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
 * REST controller for managing {@link it.unibo.avvoltoio.domain.SquealCat}.
 */
@RestController
@RequestMapping("/api")
public class SquealCatResource {

    private final Logger log = LoggerFactory.getLogger(SquealCatResource.class);

    private static final String ENTITY_NAME = "squealCat";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SquealCatRepository squealCatRepository;

    public SquealCatResource(SquealCatRepository squealCatRepository) {
        this.squealCatRepository = squealCatRepository;
    }

    /**
     * {@code POST  /squeal-cats} : Create a new squealCat.
     *
     * @param squealCat the squealCat to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new squealCat, or with status {@code 400 (Bad Request)} if the squealCat has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/squeal-cats")
    public ResponseEntity<SquealCat> createSquealCat(@RequestBody SquealCat squealCat) throws URISyntaxException {
        log.debug("REST request to save SquealCat : {}", squealCat);
        if (squealCat.getId() != null) {
            throw new BadRequestAlertException("A new squealCat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SquealCat result = squealCatRepository.save(squealCat);
        return ResponseEntity
            .created(new URI("/api/squeal-cats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /squeal-cats/:id} : Updates an existing squealCat.
     *
     * @param id the id of the squealCat to save.
     * @param squealCat the squealCat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated squealCat,
     * or with status {@code 400 (Bad Request)} if the squealCat is not valid,
     * or with status {@code 500 (Internal Server Error)} if the squealCat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/squeal-cats/{id}")
    public ResponseEntity<SquealCat> updateSquealCat(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody SquealCat squealCat
    ) throws URISyntaxException {
        log.debug("REST request to update SquealCat : {}, {}", id, squealCat);
        if (squealCat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, squealCat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!squealCatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SquealCat result = squealCatRepository.save(squealCat);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, squealCat.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /squeal-cats/:id} : Partial updates given fields of an existing squealCat, field will ignore if it is null
     *
     * @param id the id of the squealCat to save.
     * @param squealCat the squealCat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated squealCat,
     * or with status {@code 400 (Bad Request)} if the squealCat is not valid,
     * or with status {@code 404 (Not Found)} if the squealCat is not found,
     * or with status {@code 500 (Internal Server Error)} if the squealCat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/squeal-cats/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SquealCat> partialUpdateSquealCat(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody SquealCat squealCat
    ) throws URISyntaxException {
        log.debug("REST request to partial update SquealCat partially : {}, {}", id, squealCat);
        if (squealCat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, squealCat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!squealCatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SquealCat> result = squealCatRepository
            .findById(squealCat.getId())
            .map(existingSquealCat -> {
                if (squealCat.getUser_id() != null) {
                    existingSquealCat.setUser_id(squealCat.getUser_id());
                }
                if (squealCat.getSqueal_id() != null) {
                    existingSquealCat.setSqueal_id(squealCat.getSqueal_id());
                }
                if (squealCat.getCategory() != null) {
                    existingSquealCat.setCategory(squealCat.getCategory());
                }
                if (squealCat.getN_characters() != null) {
                    existingSquealCat.setN_characters(squealCat.getN_characters());
                }
                if (squealCat.getTimestamp() != null) {
                    existingSquealCat.setTimestamp(squealCat.getTimestamp());
                }

                return existingSquealCat;
            })
            .map(squealCatRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, squealCat.getId())
        );
    }

    /**
     * {@code GET  /squeal-cats} : get all the squealCats.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of squealCats in body.
     */
    @GetMapping("/squeal-cats")
    public List<SquealCat> getAllSquealCats() {
        log.debug("REST request to get all SquealCats");
        return squealCatRepository.findAll();
    }

    /**
     * {@code GET  /squeal-cats/:id} : get the "id" squealCat.
     *
     * @param id the id of the squealCat to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the squealCat, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/squeal-cats/{id}")
    public ResponseEntity<SquealCat> getSquealCat(@PathVariable String id) {
        log.debug("REST request to get SquealCat : {}", id);
        Optional<SquealCat> squealCat = squealCatRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(squealCat);
    }

    /**
     * {@code DELETE  /squeal-cats/:id} : delete the "id" squealCat.
     *
     * @param id the id of the squealCat to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/squeal-cats/{id}")
    public ResponseEntity<Void> deleteSquealCat(@PathVariable String id) {
        log.debug("REST request to delete SquealCat : {}", id);
        squealCatRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }
}
