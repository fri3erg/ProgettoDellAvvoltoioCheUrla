package it.unibo.avvoltoio.web.rest;

import it.unibo.avvoltoio.domain.SMMUser;
import it.unibo.avvoltoio.domain.SMMVIP;
import it.unibo.avvoltoio.repository.SMMVIPRepository;
import it.unibo.avvoltoio.security.AuthoritiesConstants;
import it.unibo.avvoltoio.service.SMMVIPService;
import it.unibo.avvoltoio.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link it.unibo.avvoltoio.domain.SMMVIP}.
 */
@RestController
@RequestMapping("/api")
public class SMMVIPResource {

    private final Logger log = LoggerFactory.getLogger(SMMVIPResource.class);

    private static final String ENTITY_NAME = "sMMVIP";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SMMVIPRepository sMMVIPRepository;

    @Autowired
    private SMMVIPService smmvipservice;

    public SMMVIPResource(SMMVIPRepository sMMVIPRepository) {
        this.sMMVIPRepository = sMMVIPRepository;
    }

    /**
     * {@code POST  /smmvips} : Create a new sMMVIP.
     *
     * @param sMMVIP the sMMVIP to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sMMVIP, or with status {@code 400 (Bad Request)} if the sMMVIP has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/smmvips")
    public ResponseEntity<SMMVIP> createSMMVIP(@RequestBody SMMVIP sMMVIP) throws URISyntaxException {
        log.debug("REST request to save SMMVIP : {}", sMMVIP);
        if (sMMVIP.getId() != null) {
            throw new BadRequestAlertException("A new sMMVIP cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SMMVIP result = sMMVIPRepository.save(sMMVIP);
        return ResponseEntity
            .created(new URI("/api/smmvips/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /smmvips/:id} : Updates an existing sMMVIP.
     *
     * @param id the id of the sMMVIP to save.
     * @param sMMVIP the sMMVIP to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sMMVIP,
     * or with status {@code 400 (Bad Request)} if the sMMVIP is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sMMVIP couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/smmvips/{id}")
    public ResponseEntity<SMMVIP> updateSMMVIP(@PathVariable(value = "id", required = false) final String id, @RequestBody SMMVIP sMMVIP)
        throws URISyntaxException {
        log.debug("REST request to update SMMVIP : {}, {}", id, sMMVIP);
        if (sMMVIP.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sMMVIP.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sMMVIPRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SMMVIP result = sMMVIPRepository.save(sMMVIP);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sMMVIP.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /smmvips/:id} : Partial updates given fields of an existing sMMVIP, field will ignore if it is null
     *
     * @param id the id of the sMMVIP to save.
     * @param sMMVIP the sMMVIP to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sMMVIP,
     * or with status {@code 400 (Bad Request)} if the sMMVIP is not valid,
     * or with status {@code 404 (Not Found)} if the sMMVIP is not found,
     * or with status {@code 500 (Internal Server Error)} if the sMMVIP couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/smmvips/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SMMVIP> partialUpdateSMMVIP(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody SMMVIP sMMVIP
    ) throws URISyntaxException {
        log.debug("REST request to partial update SMMVIP partially : {}, {}", id, sMMVIP);
        if (sMMVIP.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sMMVIP.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sMMVIPRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SMMVIP> result = sMMVIPRepository
            .findById(sMMVIP.getId())
            .map(existingSMMVIP -> {
                if (sMMVIP.getUserId() != null) {
                    existingSMMVIP.setUserId(sMMVIP.getUserId());
                }

                return existingSMMVIP;
            })
            .map(sMMVIPRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sMMVIP.getId()));
    }

    /**
     * {@code GET  /smmvips} : get all the sMMVIPS.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sMMVIPS in body.
     */
    @GetMapping("/smmvips")
    public List<SMMVIP> getAllSMMVIPS() {
        log.debug("REST request to get all SMMVIPS");
        return sMMVIPRepository.findAll();
    }

    /**
     * {@code GET  /smmvips/:id} : get the "id" sMMVIP.
     *
     * @param id the id of the sMMVIP to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sMMVIP, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/smmvips/{id}")
    public ResponseEntity<SMMVIP> getSMMVIP(@PathVariable String id) {
        log.debug("REST request to get SMMVIP : {}", id);
        Optional<SMMVIP> sMMVIP = sMMVIPRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sMMVIP);
    }

    /**
     * {@code DELETE  /smmvips/:id} : delete the "id" sMMVIP.
     *
     * @param id the id of the sMMVIP to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/smmvips/{id}")
    public ResponseEntity<Void> deleteSMMVIP(@PathVariable String id) {
        log.debug("REST request to delete SMMVIP : {}", id);
        sMMVIPRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }

    /**
     * {@code POST  /add-smm/:id} : Add a SMM.
     *
     * @param id of the smm
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sMMVIP, or with status {@code 400 (Bad Request)} if the sMMVIP has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/add-smm/{id}")
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "','" + AuthoritiesConstants.VIP + "')")
    public ResponseEntity<SMMVIP> addSMM(@PathVariable String id) throws URISyntaxException {
        log.debug("REST request to add SMM : {}", id);
        SMMVIP result = smmvipservice.addSMM(id);
        return ResponseEntity
            .created(new URI("/api/add-smm/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code GET  /smmclients/:id} : get all SMM clients.
     *
     * @param id of the smm
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sMMVIP, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/smmclients/{id}")
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "','" + AuthoritiesConstants.SMM + "')")
    public ResponseEntity<Set<SMMUser>> getSMMclients(@PathVariable String id) {
        log.debug("REST request to get SMM clients : {}", id);
        Set<SMMUser> sMMclients = sMMVIPRepository.findFirstByUser__id(id).map(SMMVIP::getUsers).orElse(null);
        return new ResponseEntity<>(sMMclients, HttpStatus.OK);
    }
}
