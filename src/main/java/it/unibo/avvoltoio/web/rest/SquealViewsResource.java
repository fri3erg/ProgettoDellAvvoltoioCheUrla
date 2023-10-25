package it.unibo.avvoltoio.web.rest;

import it.unibo.avvoltoio.domain.SquealViews;
import it.unibo.avvoltoio.repository.SquealViewsRepository;
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
 * REST controller for managing {@link it.unibo.avvoltoio.domain.SquealViews}.
 */
@RestController
@RequestMapping("/api")
public class SquealViewsResource {

    private final Logger log = LoggerFactory.getLogger(SquealViewsResource.class);

    private static final String ENTITY_NAME = "squealViews";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SquealViewsRepository squealViewsRepository;

    public SquealViewsResource(SquealViewsRepository squealViewsRepository) {
        this.squealViewsRepository = squealViewsRepository;
    }

    /**
     * {@code POST  /squeal-views} : Create a new squealViews.
     *
     * @param squealViews the squealViews to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new squealViews, or with status {@code 400 (Bad Request)} if the squealViews has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/squeal-views")
    public ResponseEntity<SquealViews> createSquealViews(@RequestBody SquealViews squealViews) throws URISyntaxException {
        log.debug("REST request to save SquealViews : {}", squealViews);
        if (squealViews.getId() != null) {
            throw new BadRequestAlertException("A new squealViews cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SquealViews result = squealViewsRepository.save(squealViews);
        return ResponseEntity
            .created(new URI("/api/squeal-views/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /squeal-views/:id} : Updates an existing squealViews.
     *
     * @param id the id of the squealViews to save.
     * @param squealViews the squealViews to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated squealViews,
     * or with status {@code 400 (Bad Request)} if the squealViews is not valid,
     * or with status {@code 500 (Internal Server Error)} if the squealViews couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/squeal-views/{id}")
    public ResponseEntity<SquealViews> updateSquealViews(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody SquealViews squealViews
    ) throws URISyntaxException {
        log.debug("REST request to update SquealViews : {}, {}", id, squealViews);
        if (squealViews.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, squealViews.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!squealViewsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SquealViews result = squealViewsRepository.save(squealViews);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, squealViews.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /squeal-views/:id} : Partial updates given fields of an existing squealViews, field will ignore if it is null
     *
     * @param id the id of the squealViews to save.
     * @param squealViews the squealViews to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated squealViews,
     * or with status {@code 400 (Bad Request)} if the squealViews is not valid,
     * or with status {@code 404 (Not Found)} if the squealViews is not found,
     * or with status {@code 500 (Internal Server Error)} if the squealViews couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/squeal-views/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SquealViews> partialUpdateSquealViews(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody SquealViews squealViews
    ) throws URISyntaxException {
        log.debug("REST request to partial update SquealViews partially : {}, {}", id, squealViews);
        if (squealViews.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, squealViews.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!squealViewsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SquealViews> result = squealViewsRepository
            .findById(squealViews.getId())
            .map(existingSquealViews -> {
                if (squealViews.getSqueal_id() != null) {
                    existingSquealViews.setSqueal_id(squealViews.getSqueal_id());
                }
                if (squealViews.getNumber() != null) {
                    existingSquealViews.setNumber(squealViews.getNumber());
                }

                return existingSquealViews;
            })
            .map(squealViewsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, squealViews.getId())
        );
    }

    /**
     * {@code GET  /squeal-views} : get all the squealViews.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of squealViews in body.
     */
    @GetMapping("/squeal-views")
    public List<SquealViews> getAllSquealViews() {
        log.debug("REST request to get all SquealViews");
        return squealViewsRepository.findAll();
    }

    /**
     * {@code GET  /squeal-views/:id} : get the "id" squealViews.
     *
     * @param id the id of the squealViews to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the squealViews, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/squeal-views/{id}")
    public ResponseEntity<SquealViews> getSquealViews(@PathVariable String id) {
        log.debug("REST request to get SquealViews : {}", id);
        Optional<SquealViews> squealViews = squealViewsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(squealViews);
    }

    /**
     * {@code DELETE  /squeal-views/:id} : delete the "id" squealViews.
     *
     * @param id the id of the squealViews to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/squeal-views/{id}")
    public ResponseEntity<Void> deleteSquealViews(@PathVariable String id) {
        log.debug("REST request to delete SquealViews : {}", id);
        squealViewsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }
}
