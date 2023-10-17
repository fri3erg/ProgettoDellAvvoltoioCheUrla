package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.SMMVIP;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the SMMVIP entity.
 */
@Repository
public interface SMMVIPRepository extends MongoRepository<SMMVIP, String> {

}
