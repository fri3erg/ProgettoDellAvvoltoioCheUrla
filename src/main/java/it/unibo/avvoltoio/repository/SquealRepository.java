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

    List<Squeal> findAllByDestinations_Destination__idInOrderByTimestampDesc(List<String> destinationIds, Pageable page);

    List<Squeal> findAllByUser_idAndTimestampGreaterThanOrderByTimestamp(String userId, long smTime);

    List<Squeal> findAllByDestinations_DestinationIdOrderByUser__id(String currentUserId);

    List<Squeal> findAllByUser_idAndDestinations_Destination__idOrderByTimestamp(String userId, String currentUserId, Pageable page);

    Long countByDestinations_Destination__id(String id);

    List<Squeal> findAllByUser__id(String currentUserId, Pageable page);

    Long countByUser__id(String userId);

    List<Squeal> findAllByUser__id(String id);
}
