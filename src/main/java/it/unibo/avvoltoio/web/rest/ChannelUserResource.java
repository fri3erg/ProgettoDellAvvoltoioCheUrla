package it.unibo.avvoltoio.web.rest;

import it.unibo.avvoltoio.domain.ChannelUser;
import it.unibo.avvoltoio.repository.ChannelUserRepository;
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
 * REST controller for managing {@link it.unibo.avvoltoio.domain.ChannelUser}.
 */
@RestController
@RequestMapping("/api")
public class ChannelUserResource {

    private final Logger log = LoggerFactory.getLogger(ChannelUserResource.class);

    private static final String ENTITY_NAME = "channelUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChannelUserRepository channelUserRepository;

    public ChannelUserResource(ChannelUserRepository channelUserRepository) {
        this.channelUserRepository = channelUserRepository;
    }

    /**
     * {@code POST  /channel-users} : Create a new channelUser.
     *
     * @param channelUser the channelUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new channelUser, or with status {@code 400 (Bad Request)} if the channelUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/channel-users")
    public ResponseEntity<ChannelUser> createChannelUser(@RequestBody ChannelUser channelUser) throws URISyntaxException {
        log.debug("REST request to save ChannelUser : {}", channelUser);
        if (channelUser.getId() != null) {
            throw new BadRequestAlertException("A new channelUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChannelUser result = channelUserRepository.save(channelUser);
        return ResponseEntity
            .created(new URI("/api/channel-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /channel-users/:id} : Updates an existing channelUser.
     *
     * @param id the id of the channelUser to save.
     * @param channelUser the channelUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated channelUser,
     * or with status {@code 400 (Bad Request)} if the channelUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the channelUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/channel-users/{id}")
    public ResponseEntity<ChannelUser> updateChannelUser(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody ChannelUser channelUser
    ) throws URISyntaxException {
        log.debug("REST request to update ChannelUser : {}, {}", id, channelUser);
        if (channelUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, channelUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!channelUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChannelUser result = channelUserRepository.save(channelUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, channelUser.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /channel-users/:id} : Partial updates given fields of an existing channelUser, field will ignore if it is null
     *
     * @param id the id of the channelUser to save.
     * @param channelUser the channelUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated channelUser,
     * or with status {@code 400 (Bad Request)} if the channelUser is not valid,
     * or with status {@code 404 (Not Found)} if the channelUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the channelUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/channel-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChannelUser> partialUpdateChannelUser(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody ChannelUser channelUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update ChannelUser partially : {}, {}", id, channelUser);
        if (channelUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, channelUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!channelUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChannelUser> result = channelUserRepository
            .findById(channelUser.getId())
            .map(existingChannelUser -> {
                if (channelUser.getUserId() != null) {
                    existingChannelUser.setUserId(channelUser.getUserId());
                }
                if (channelUser.getChannelId() != null) {
                    existingChannelUser.setChannelId(channelUser.getChannelId());
                }
                if (channelUser.getPrivilege() != null) {
                    existingChannelUser.setPrivilege(channelUser.getPrivilege());
                }

                return existingChannelUser;
            })
            .map(channelUserRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, channelUser.getId())
        );
    }

    /**
     * {@code GET  /channel-users} : get all the channelUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of channelUsers in body.
     */
    @GetMapping("/channel-users")
    public List<ChannelUser> getAllChannelUsers() {
        log.debug("REST request to get all ChannelUsers");
        return channelUserRepository.findAll();
    }

    /**
     * {@code GET  /channel-users/:id} : get the "id" channelUser.
     *
     * @param id the id of the channelUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the channelUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/channel-users/{id}")
    public ResponseEntity<ChannelUser> getChannelUser(@PathVariable String id) {
        log.debug("REST request to get ChannelUser : {}", id);
        Optional<ChannelUser> channelUser = channelUserRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(channelUser);
    }

    /**
     * {@code DELETE  /channel-users/:id} : delete the "id" channelUser.
     *
     * @param id the id of the channelUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/channel-users/{id}")
    public ResponseEntity<Void> deleteChannelUser(@PathVariable String id) {
        log.debug("REST request to delete ChannelUser : {}", id);
        channelUserRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }
}
