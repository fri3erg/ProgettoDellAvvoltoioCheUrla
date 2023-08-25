package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.ChannelUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the ChannelUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChannelUserRepository extends MongoRepository<ChannelUser, String> {}
