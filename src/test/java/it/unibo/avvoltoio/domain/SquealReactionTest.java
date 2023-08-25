package it.unibo.avvoltoio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import it.unibo.avvoltoio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SquealReactionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SquealReaction.class);
        SquealReaction squealReaction1 = new SquealReaction();
        squealReaction1.setId("id1");
        SquealReaction squealReaction2 = new SquealReaction();
        squealReaction2.setId(squealReaction1.getId());
        assertThat(squealReaction1).isEqualTo(squealReaction2);
        squealReaction2.setId("id2");
        assertThat(squealReaction1).isNotEqualTo(squealReaction2);
        squealReaction1.setId(null);
        assertThat(squealReaction1).isNotEqualTo(squealReaction2);
    }
}
