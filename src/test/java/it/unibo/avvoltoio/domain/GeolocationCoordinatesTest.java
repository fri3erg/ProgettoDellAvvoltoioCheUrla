package it.unibo.avvoltoio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import it.unibo.avvoltoio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GeolocationCoordinatesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GeolocationCoordinates.class);
        GeolocationCoordinates geolocationCoordinates1 = new GeolocationCoordinates();
        geolocationCoordinates1.setId("id1");
        GeolocationCoordinates geolocationCoordinates2 = new GeolocationCoordinates();
        geolocationCoordinates2.setId(geolocationCoordinates1.getId());
        assertThat(geolocationCoordinates1).isEqualTo(geolocationCoordinates2);
        geolocationCoordinates2.setId("id2");
        assertThat(geolocationCoordinates1).isNotEqualTo(geolocationCoordinates2);
        geolocationCoordinates1.setId(null);
        assertThat(geolocationCoordinates1).isNotEqualTo(geolocationCoordinates2);
    }
}
