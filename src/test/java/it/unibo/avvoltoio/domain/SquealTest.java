package it.unibo.avvoltoio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import it.unibo.avvoltoio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SquealTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Squeal.class);
        Squeal squeal1 = new Squeal();
        squeal1.setId("id1");
        Squeal squeal2 = new Squeal();
        squeal2.setId(squeal1.getId());
        assertThat(squeal1).isEqualTo(squeal2);
        squeal2.setId("id2");
        assertThat(squeal1).isNotEqualTo(squeal2);
        squeal1.setId(null);
        assertThat(squeal1).isNotEqualTo(squeal2);
    }
}
