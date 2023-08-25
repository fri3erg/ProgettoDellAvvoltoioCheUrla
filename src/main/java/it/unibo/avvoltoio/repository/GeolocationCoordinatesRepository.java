package it.unibo.avvoltoio.repository;

import it.unibo.avvoltoio.domain.GeolocationCoordinates;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the GeolocationCoordinates entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GeolocationCoordinatesRepository extends MongoRepository<GeolocationCoordinates, String> {}
