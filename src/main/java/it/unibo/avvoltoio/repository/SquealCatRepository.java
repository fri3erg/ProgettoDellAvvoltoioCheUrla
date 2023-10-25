package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.SquealCat;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the SquealCat entity.
 */
@Repository
public interface SquealCatRepository extends MongoRepository<SquealCat, String> {
    Optional<SquealCat> findFirstBySqueal_id(String squealId);
}
