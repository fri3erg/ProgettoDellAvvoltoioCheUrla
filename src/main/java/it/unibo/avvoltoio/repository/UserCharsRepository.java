package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.UserChars;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the UserChars entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserCharsRepository extends MongoRepository<UserChars, String> {
    Optional<UserChars> findByUser__id(String currentUserId);
}
