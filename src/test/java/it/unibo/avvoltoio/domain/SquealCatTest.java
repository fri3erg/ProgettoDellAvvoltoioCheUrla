package it.unibo.avvoltoio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import it.unibo.avvoltoio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SquealCatTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SquealCat.class);
        SquealCat squealCat1 = new SquealCat();
        squealCat1.setId("id1");
        SquealCat squealCat2 = new SquealCat();
        squealCat2.setId(squealCat1.getId());
        assertThat(squealCat1).isEqualTo(squealCat2);
        squealCat2.setId("id2");
        assertThat(squealCat1).isNotEqualTo(squealCat2);
        squealCat1.setId(null);
        assertThat(squealCat1).isNotEqualTo(squealCat2);
    }
}
