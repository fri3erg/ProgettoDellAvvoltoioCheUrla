package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.Channel;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Channel entity.
 */
@Repository
public interface ChannelRepository extends MongoRepository<Channel, String> {
    Optional<Channel> findFirstByName(String name);

    List<Channel> findAllByNameContainsOrderByName(String name);
    Channel findFirstById(String id);
}
