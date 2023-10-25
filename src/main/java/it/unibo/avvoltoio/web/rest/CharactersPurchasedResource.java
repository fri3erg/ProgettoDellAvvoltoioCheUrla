package it.unibo.avvoltoio.web.rest;

import it.unibo.avvoltoio.domain.CharactersPurchased;
import it.unibo.avvoltoio.repository.CharactersPurchasedRepository;
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
 * REST controller for managing {@link it.unibo.avvoltoio.domain.CharactersPurchased}.
 */
@RestController
@RequestMapping("/api")
public class CharactersPurchasedResource {

    private final Logger log = LoggerFactory.getLogger(CharactersPurchasedResource.class);

    private static final String ENTITY_NAME = "charactersPurchased";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CharactersPurchasedRepository charactersPurchasedRepository;

    public CharactersPurchasedResource(CharactersPurchasedRepository charactersPurchasedRepository) {
        this.charactersPurchasedRepository = charactersPurchasedRepository;
    }

    /**
     * {@code POST  /characters-purchaseds} : Create a new charactersPurchased.
     *
     * @param charactersPurchased the charactersPurchased to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new charactersPurchased, or with status {@code 400 (Bad Request)} if the charactersPurchased has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/characters-purchaseds")
    public ResponseEntity<CharactersPurchased> createCharactersPurchased(@RequestBody CharactersPurchased charactersPurchased)
        throws URISyntaxException {
        log.debug("REST request to save CharactersPurchased : {}", charactersPurchased);
        if (charactersPurchased.getId() != null) {
            throw new BadRequestAlertException("A new charactersPurchased cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CharactersPurchased result = charactersPurchasedRepository.save(charactersPurchased);
        return ResponseEntity
            .created(new URI("/api/characters-purchaseds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /characters-purchaseds/:id} : Updates an existing charactersPurchased.
     *
     * @param id the id of the charactersPurchased to save.
     * @param charactersPurchased the charactersPurchased to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charactersPurchased,
     * or with status {@code 400 (Bad Request)} if the charactersPurchased is not valid,
     * or with status {@code 500 (Internal Server Error)} if the charactersPurchased couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/characters-purchaseds/{id}")
    public ResponseEntity<CharactersPurchased> updateCharactersPurchased(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody CharactersPurchased charactersPurchased
    ) throws URISyntaxException {
        log.debug("REST request to update CharactersPurchased : {}, {}", id, charactersPurchased);
        if (charactersPurchased.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charactersPurchased.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charactersPurchasedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CharactersPurchased result = charactersPurchasedRepository.save(charactersPurchased);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charactersPurchased.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /characters-purchaseds/:id} : Partial updates given fields of an existing charactersPurchased, field will ignore if it is null
     *
     * @param id the id of the charactersPurchased to save.
     * @param charactersPurchased the charactersPurchased to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charactersPurchased,
     * or with status {@code 400 (Bad Request)} if the charactersPurchased is not valid,
     * or with status {@code 404 (Not Found)} if the charactersPurchased is not found,
     * or with status {@code 500 (Internal Server Error)} if the charactersPurchased couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/characters-purchaseds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CharactersPurchased> partialUpdateCharactersPurchased(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody CharactersPurchased charactersPurchased
    ) throws URISyntaxException {
        log.debug("REST request to partial update CharactersPurchased partially : {}, {}", id, charactersPurchased);
        if (charactersPurchased.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charactersPurchased.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charactersPurchasedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CharactersPurchased> result = charactersPurchasedRepository
            .findById(charactersPurchased.getId())
            .map(existingCharactersPurchased -> {
                if (charactersPurchased.getUser_id() != null) {
                    existingCharactersPurchased.setUser_id(charactersPurchased.getUser_id());
                }
                if (charactersPurchased.getN_characters() != null) {
                    existingCharactersPurchased.setN_characters(charactersPurchased.getN_characters());
                }
                if (charactersPurchased.getTimestamp_bought() != null) {
                    existingCharactersPurchased.setTimestamp_bought(charactersPurchased.getTimestamp_bought());
                }
                if (charactersPurchased.getTimestamp_expire() != null) {
                    existingCharactersPurchased.setTimestamp_expire(charactersPurchased.getTimestamp_expire());
                }
                if (charactersPurchased.getAmount() != null) {
                    existingCharactersPurchased.setAmount(charactersPurchased.getAmount());
                }
                if (charactersPurchased.getAdmin_discount() != null) {
                    existingCharactersPurchased.setAdmin_discount(charactersPurchased.getAdmin_discount());
                }

                return existingCharactersPurchased;
            })
            .map(charactersPurchasedRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, charactersPurchased.getId())
        );
    }

    /**
     * {@code GET  /characters-purchaseds} : get all the charactersPurchaseds.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of charactersPurchaseds in body.
     */
    @GetMapping("/characters-purchaseds")
    public List<CharactersPurchased> getAllCharactersPurchaseds() {
        log.debug("REST request to get all CharactersPurchaseds");
        return charactersPurchasedRepository.findAll();
    }

    /**
     * {@code GET  /characters-purchaseds/:id} : get the "id" charactersPurchased.
     *
     * @param id the id of the charactersPurchased to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the charactersPurchased, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/characters-purchaseds/{id}")
    public ResponseEntity<CharactersPurchased> getCharactersPurchased(@PathVariable String id) {
        log.debug("REST request to get CharactersPurchased : {}", id);
        Optional<CharactersPurchased> charactersPurchased = charactersPurchasedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(charactersPurchased);
    }

    /**
     * {@code DELETE  /characters-purchaseds/:id} : delete the "id" charactersPurchased.
     *
     * @param id the id of the charactersPurchased to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/characters-purchaseds/{id}")
    public ResponseEntity<Void> deleteCharactersPurchased(@PathVariable String id) {
        log.debug("REST request to delete CharactersPurchased : {}", id);
        charactersPurchasedRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }
}
