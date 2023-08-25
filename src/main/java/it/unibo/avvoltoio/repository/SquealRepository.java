package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.Squeal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Squeal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SquealRepository extends MongoRepository<Squeal, String> {}
