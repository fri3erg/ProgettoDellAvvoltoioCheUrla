package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.ChannelUser;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the ChannelUser entity.
 */
@Repository
public interface ChannelUserRepository extends MongoRepository<ChannelUser, String> {
    List<ChannelUser> findAllByChannelId(String id);
}
