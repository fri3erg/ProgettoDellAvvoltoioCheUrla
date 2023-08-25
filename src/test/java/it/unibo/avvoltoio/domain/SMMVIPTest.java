package it.unibo.avvoltoio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import it.unibo.avvoltoio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SMMVIPTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SMMVIP.class);
        SMMVIP sMMVIP1 = new SMMVIP();
        sMMVIP1.setId("id1");
        SMMVIP sMMVIP2 = new SMMVIP();
        sMMVIP2.setId(sMMVIP1.getId());
        assertThat(sMMVIP1).isEqualTo(sMMVIP2);
        sMMVIP2.setId("id2");
        assertThat(sMMVIP1).isNotEqualTo(sMMVIP2);
        sMMVIP1.setId(null);
        assertThat(sMMVIP1).isNotEqualTo(sMMVIP2);
    }
}
