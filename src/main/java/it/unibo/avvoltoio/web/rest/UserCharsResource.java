package it.unibo.avvoltoio.web.rest;

import it.unibo.avvoltoio.domain.UserChars;
import it.unibo.avvoltoio.repository.UserCharsRepository;
import it.unibo.avvoltoio.service.UserCharsService;
import it.unibo.avvoltoio.service.dto.UserCharsDTO;
import it.unibo.avvoltoio.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link it.unibo.avvoltoio.domain.UserChars}.
 */
@RestController
@RequestMapping("/api")
public class UserCharsResource {

    private final Logger log = LoggerFactory.getLogger(UserCharsResource.class);

    private static final String ENTITY_NAME = "userChars";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    UserCharsService userCharsService;

    private final UserCharsRepository userCharsRepository;

    public UserCharsResource(UserCharsRepository userCharsRepository) {
        this.userCharsRepository = userCharsRepository;
    }

    @GetMapping("/user-chars")
    public ResponseEntity<UserCharsDTO> getChars() {
        log.debug("REST request to get chars : {}");
        UserCharsDTO ret = userCharsService.calcChars();
        return new ResponseEntity<>(ret, HttpStatus.OK);
    }

    /*@GetMapping("/user-characters")
    public ResponseEntity<Integer> getChars() {
        log.debug("REST request to get chars : {}");
        Integer ret = userCharsService.getCurrentUserChars().get().getRemaningChars();
        return new ResponseEntity<>(ret, HttpStatus.OK);
    }
    */
    /**
     * {@code POST  /user-chars} : Create a new userChars.
     *
     * @param userChars the userChars to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userChars, or with status {@code 400 (Bad Request)} if the userChars has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-chars")
    public ResponseEntity<UserChars> createUserChars(@RequestBody UserChars userChars) throws URISyntaxException {
        log.debug("REST request to save UserChars : {}", userChars);
        if (userChars.getId() != null) {
            throw new BadRequestAlertException("A new userChars cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserChars result = userCharsRepository.save(userChars);
        return ResponseEntity
            .created(new URI("/api/user-chars/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /user-chars/:id} : Updates an existing userChars.
     *
     * @param id the id of the userChars to save.
     * @param userChars the userChars to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userChars,
     * or with status {@code 400 (Bad Request)} if the userChars is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userChars couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-chars/{id}")
    public ResponseEntity<UserChars> updateUserChars(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody UserChars userChars
    ) throws URISyntaxException {
        log.debug("REST request to update UserChars : {}, {}", id, userChars);
        if (userChars.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userChars.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userCharsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserChars result = userCharsRepository.save(userChars);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userChars.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-chars/:id} : Partial updates given fields of an existing userChars, field will ignore if it is null
     *
     * @param id the id of the userChars to save.
     * @param userChars the userChars to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userChars,
     * or with status {@code 400 (Bad Request)} if the userChars is not valid,
     * or with status {@code 404 (Not Found)} if the userChars is not found,
     * or with status {@code 500 (Internal Server Error)} if the userChars couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-chars/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserChars> partialUpdateUserChars(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody UserChars userChars
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserChars partially : {}, {}", id, userChars);
        if (userChars.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userChars.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userCharsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserChars> result = userCharsRepository
            .findById(userChars.getId())
            .map(existingUserChars -> {
                if (userChars.getUserId() != null) {
                    existingUserChars.setUserId(userChars.getUserId());
                }
                if (userChars.getMaxChars() != null) {
                    existingUserChars.setMaxChars(userChars.getMaxChars());
                }
                if (userChars.getRemaningChars() != null) {
                    existingUserChars.setRemaningChars(userChars.getRemaningChars());
                }

                return existingUserChars;
            })
            .map(userCharsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userChars.getId())
        );
    }

    /**
     * {@code GET  /user-chars} : get all the userChars.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userChars in body.
     */
    //    @GetMapping("/user-chars")
    //    public List<UserChars> getAllUserChars() {
    //        log.debug("REST request to get all UserChars");
    //        return userCharsRepository.findAll();
    //    }

    /**
     * {@code GET  /user-chars/:id} : get the "id" userChars.
     *
     * @param id the id of the userChars to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userChars, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-chars/{id}")
    public ResponseEntity<UserChars> getUserChars(@PathVariable String id) {
        log.debug("REST request to get UserChars : {}", id);
        Optional<UserChars> userChars = userCharsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userChars);
    }

    /**
     * {@code DELETE  /user-chars/:id} : delete the "id" userChars.
     *
     * @param id the id of the userChars to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-chars/{id}")
    public ResponseEntity<Void> deleteUserChars(@PathVariable String id) {
        log.debug("REST request to delete UserChars : {}", id);
        userCharsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }
}
