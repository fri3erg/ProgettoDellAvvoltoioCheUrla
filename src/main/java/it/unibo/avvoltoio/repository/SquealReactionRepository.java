package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.SquealReaction;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the SquealReaction entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SquealReactionRepository extends MongoRepository<SquealReaction, String> {
    List<SquealReaction> findAllBySquealId(String id);

    Optional<SquealReaction> findFirstByUserId(String id);

    List<SquealReaction> findAllByUserIdOrderByEmoji();
}
