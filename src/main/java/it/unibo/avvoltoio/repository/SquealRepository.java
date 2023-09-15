package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.Squeal;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Squeal entity.
 */
@Repository
public interface SquealRepository extends MongoRepository<Squeal, String> {
    List<Squeal> findAllByDestinations_DestinationIgnoreCaseOrderByTimestampDesc(String destination);

    List<Squeal> findAllByDestinations_DestinationIdInOrderByTimestampDesc(List<String> destinationIds, Pageable page);

    List<Squeal> findAllByUserIdAndTimestampGreaterThanOrderByTimestamp(String userId, long smTime);

    List<Squeal> findAllByDestinations_DestinationIdOrderByUserId(String currentUserId);
}
