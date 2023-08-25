package it.unibo.avvoltoio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import it.unibo.avvoltoio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SquealViewsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SquealViews.class);
        SquealViews squealViews1 = new SquealViews();
        squealViews1.setId("id1");
        SquealViews squealViews2 = new SquealViews();
        squealViews2.setId(squealViews1.getId());
        assertThat(squealViews1).isEqualTo(squealViews2);
        squealViews2.setId("id2");
        assertThat(squealViews1).isNotEqualTo(squealViews2);
        squealViews1.setId(null);
        assertThat(squealViews1).isNotEqualTo(squealViews2);
    }
}
