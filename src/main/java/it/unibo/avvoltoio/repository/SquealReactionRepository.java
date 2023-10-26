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
    List<SquealReaction> findAllBySqueal__id(String id);

    Optional<SquealReaction> findFirstByUser__id(String id);

    List<SquealReaction> findAllByUser__idOrderByEmoji();

    Optional<SquealReaction> findFirstByUser__idAndSqueal__id(String userId, String squealId);

    Long countBySqueal__idAndPositive(List<String> ids, boolean b);
}
