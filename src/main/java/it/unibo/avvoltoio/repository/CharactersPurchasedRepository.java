package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.CharactersPurchased;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the CharactersPurchased entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CharactersPurchasedRepository extends MongoRepository<CharactersPurchased, String> {}
