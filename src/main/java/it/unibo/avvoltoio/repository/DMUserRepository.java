package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.DmUser;
import java.util.List;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Squeal entity.
 */
@Repository
public interface DMUserRepository extends MongoRepository<DmUser, String> {
    @Aggregation(
        pipeline = {
            "{\r\n" + "      $match: {\r\n" + "        'destination.destination_id': ?0\r\n" + "      }\r\n" + "    }",
            "{ $sort: { timestamp: -1 } }",
            "{\r\n" +
            "      $group: {\r\n" +
            "        _id: '$user_id',\r\n" +
            "        body: { $first: '$body' },\r\n" +
            "        sum: { $sum: 1 },\r\n" +
            "        timestamp: { $max: '$timestamp' }\r\n" +
            "      }\r\n" +
            "    }",
        }
    )
    List<DmUser> findDirectMessageUser(String toUserId);
}
