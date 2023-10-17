package it.unibo.avvoltoio.web.rest;

import it.unibo.avvoltoio.domain.SquealReaction;
import it.unibo.avvoltoio.repository.SquealReactionRepository;
import it.unibo.avvoltoio.service.SquealService;
import it.unibo.avvoltoio.service.dto.ReactionDTO;
import it.unibo.avvoltoio.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing
 * {@link it.unibo.avvoltoio.domain.SquealReaction}.
 */
@RestController
@RequestMapping("/api")
public class SquealReactionResource {

    private final Logger log = LoggerFactory.getLogger(SquealReactionResource.class);

    private static final String ENTITY_NAME = "squealReaction";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SquealReactionRepository squealReactionRepository;

    @Autowired
    private SquealService squealService;

    public SquealReactionResource(SquealReactionRepository squealReactionRepository) {
        this.squealReactionRepository = squealReactionRepository;
    }

    /**
     * {@code POST  /squeal-reactions} : Create a new squealReaction.
     *
     * @param squealReaction the squealReaction to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new squealReaction, or with status {@code 400 (Bad Request)}
     *         if the squealReaction has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */

    @PostMapping("/squeal-reaction/create")
    public ResponseEntity<List<ReactionDTO>> createOrUpdateReaction(@RequestBody SquealReaction reaction) throws URISyntaxException {
        log.debug("REST request to save reaction : {}", reaction);
        List<ReactionDTO> result = squealService.insertOrUpdateReaction(reaction, squealService.getCurrentUserId());
        return ResponseEntity.created(new URI("/api/squeal-reaction")).body(result);
    }

    @PostMapping("/squeal-reaction-smm/create/{id}")
    public ResponseEntity<List<ReactionDTO>> createOrUpdateReaction(@PathVariable String id, @RequestBody SquealReaction reaction)
        throws URISyntaxException {
        log.debug("REST request to save reaction : {}", reaction);
        List<ReactionDTO> result = squealService.insertOrUpdateReaction(reaction, id);
        return ResponseEntity.created(new URI("/api/squeal-reaction")).body(result);
    }

    /**
     * {@code PUT  /squeal-reactions/:id} : Updates an existing squealReaction.
     *
     * @param id             the id of the squealReaction to save.
     * @param squealReaction the squealReaction to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated squealReaction, or with status {@code 400 (Bad Request)}
     *         if the squealReaction is not valid, or with status
     *         {@code 500 (Internal Server Error)} if the squealReaction couldn't be
     *         updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/squeal-reactions/{id}")
    public ResponseEntity<SquealReaction> updateSquealReaction(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody SquealReaction squealReaction
    ) throws URISyntaxException {
        log.debug("REST request to update SquealReaction : {}, {}", id, squealReaction);
        if (squealReaction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, squealReaction.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!squealReactionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SquealReaction result = squealReactionRepository.save(squealReaction);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, squealReaction.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /squeal-reactions/:id} : Partial updates given fields of an
     * existing squealReaction, field will ignore if it is null
     *
     * @param id             the id of the squealReaction to save.
     * @param squealReaction the squealReaction to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated squealReaction, or with status {@code 400 (Bad Request)}
     *         if the squealReaction is not valid, or with status
     *         {@code 404 (Not Found)} if the squealReaction is not found, or with
     *         status {@code 500 (Internal Server Error)} if the squealReaction
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/squeal-reactions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SquealReaction> partialUpdateSquealReaction(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody SquealReaction squealReaction
    ) throws URISyntaxException {
        log.debug("REST request to partial update SquealReaction partially : {}, {}", id, squealReaction);
        if (squealReaction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, squealReaction.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!squealReactionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SquealReaction> result = squealReactionRepository
            .findById(squealReaction.getId())
            .map(existingSquealReaction -> {
                if (squealReaction.getUserId() != null) {
                    existingSquealReaction.setUserId(squealReaction.getUserId());
                }
                if (squealReaction.getUsername() != null) {
                    existingSquealReaction.setUsername(squealReaction.getUsername());
                }
                if (squealReaction.getSquealId() != null) {
                    existingSquealReaction.setSquealId(squealReaction.getSquealId());
                }
                if (squealReaction.getPositive() != null) {
                    existingSquealReaction.setPositive(squealReaction.getPositive());
                }
                if (squealReaction.getEmoji() != null) {
                    existingSquealReaction.setEmoji(squealReaction.getEmoji());
                }

                return existingSquealReaction;
            })
            .map(squealReactionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, squealReaction.getId())
        );
    }

    /**
     * {@code GET  /squeal-reactions} : get all the squealReactions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of squealReactions in body.
     */
    @GetMapping("/squeal-reactions")
    public List<SquealReaction> getAllSquealReactions() {
        log.debug("REST request to get all SquealReactions");
        return squealReactionRepository.findAll();
    }

    @GetMapping("/reactions-positive/get/{id}")
    public Long getPositiveReactions(@PathVariable String id) {
        log.debug("REST request to get all SquealReactions positive", id);
        return squealService.getPositiveReactions(id);
    }

    /**
     * {@code GET  /squeal-reactions/:id} : get the "id" squealReaction.
     *
     * @param id the id of the squealReaction to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the squealReaction, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/squeal-reactions/{id}")
    public ResponseEntity<SquealReaction> getSquealReaction(@PathVariable String id) {
        log.debug("REST request to get SquealReaction : {}", id);
        Optional<SquealReaction> squealReaction = squealReactionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(squealReaction);
    }

    /**
     * {@code DELETE  /squeal-reactions/:id} : delete the "id" squealReaction.
     *
     * @param id the id of the squealReaction to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/squeal-reactions/{id}")
    public ResponseEntity<Void> deleteSquealReaction(@PathVariable String id) {
        log.debug("REST request to delete SquealReaction : {}", id);
        squealReactionRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }
}
