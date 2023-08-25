package it.unibo.avvoltoio.web.rest;

import it.unibo.avvoltoio.domain.Squeal;
import it.unibo.avvoltoio.repository.SquealRepository;
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
 * REST controller for managing {@link it.unibo.avvoltoio.domain.Squeal}.
 */
@RestController
@RequestMapping("/api")
public class SquealResource {

    private final Logger log = LoggerFactory.getLogger(SquealResource.class);

    private static final String ENTITY_NAME = "squeal";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SquealRepository squealRepository;

    public SquealResource(SquealRepository squealRepository) {
        this.squealRepository = squealRepository;
    }

    /**
     * {@code POST  /squeals} : Create a new squeal.
     *
     * @param squeal the squeal to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new squeal, or with status {@code 400 (Bad Request)} if the squeal has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/squeals")
    public ResponseEntity<Squeal> createSqueal(@RequestBody Squeal squeal) throws URISyntaxException {
        log.debug("REST request to save Squeal : {}", squeal);
        if (squeal.getId() != null) {
            throw new BadRequestAlertException("A new squeal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Squeal result = squealRepository.save(squeal);
        return ResponseEntity
            .created(new URI("/api/squeals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /squeals/:id} : Updates an existing squeal.
     *
     * @param id the id of the squeal to save.
     * @param squeal the squeal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated squeal,
     * or with status {@code 400 (Bad Request)} if the squeal is not valid,
     * or with status {@code 500 (Internal Server Error)} if the squeal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/squeals/{id}")
    public ResponseEntity<Squeal> updateSqueal(@PathVariable(value = "id", required = false) final String id, @RequestBody Squeal squeal)
        throws URISyntaxException {
        log.debug("REST request to update Squeal : {}, {}", id, squeal);
        if (squeal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, squeal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!squealRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Squeal result = squealRepository.save(squeal);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, squeal.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /squeals/:id} : Partial updates given fields of an existing squeal, field will ignore if it is null
     *
     * @param id the id of the squeal to save.
     * @param squeal the squeal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated squeal,
     * or with status {@code 400 (Bad Request)} if the squeal is not valid,
     * or with status {@code 404 (Not Found)} if the squeal is not found,
     * or with status {@code 500 (Internal Server Error)} if the squeal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/squeals/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Squeal> partialUpdateSqueal(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Squeal squeal
    ) throws URISyntaxException {
        log.debug("REST request to partial update Squeal partially : {}, {}", id, squeal);
        if (squeal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, squeal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!squealRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Squeal> result = squealRepository
            .findById(squeal.getId())
            .map(existingSqueal -> {
                if (squeal.getUserId() != null) {
                    existingSqueal.setUserId(squeal.getUserId());
                }
                if (squeal.getTimestamp() != null) {
                    existingSqueal.setTimestamp(squeal.getTimestamp());
                }
                if (squeal.getBody() != null) {
                    existingSqueal.setBody(squeal.getBody());
                }
                if (squeal.getImg() != null) {
                    existingSqueal.setImg(squeal.getImg());
                }
                if (squeal.getImgContentType() != null) {
                    existingSqueal.setImgContentType(squeal.getImgContentType());
                }
                if (squeal.getImgName() != null) {
                    existingSqueal.setImgName(squeal.getImgName());
                }
                if (squeal.getVideoContentType() != null) {
                    existingSqueal.setVideoContentType(squeal.getVideoContentType());
                }
                if (squeal.getVideoName() != null) {
                    existingSqueal.setVideoName(squeal.getVideoName());
                }
                if (squeal.getnCharacters() != null) {
                    existingSqueal.setnCharacters(squeal.getnCharacters());
                }
                if (squeal.getSquealIdResponse() != null) {
                    existingSqueal.setSquealIdResponse(squeal.getSquealIdResponse());
                }
                if (squeal.getRefreshTime() != null) {
                    existingSqueal.setRefreshTime(squeal.getRefreshTime());
                }

                return existingSqueal;
            })
            .map(squealRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, squeal.getId()));
    }

    /**
     * {@code GET  /squeals} : get all the squeals.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of squeals in body.
     */
    @GetMapping("/squeals")
    public List<Squeal> getAllSqueals() {
        log.debug("REST request to get all Squeals");
        return squealRepository.findAll();
    }

    /**
     * {@code GET  /squeals/:id} : get the "id" squeal.
     *
     * @param id the id of the squeal to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the squeal, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/squeals/{id}")
    public ResponseEntity<Squeal> getSqueal(@PathVariable String id) {
        log.debug("REST request to get Squeal : {}", id);
        Optional<Squeal> squeal = squealRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(squeal);
    }

    /**
     * {@code DELETE  /squeals/:id} : delete the "id" squeal.
     *
     * @param id the id of the squeal to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/squeals/{id}")
    public ResponseEntity<Void> deleteSqueal(@PathVariable String id) {
        log.debug("REST request to delete Squeal : {}", id);
        squealRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }
}
