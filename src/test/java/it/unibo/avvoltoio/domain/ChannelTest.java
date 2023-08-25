package it.unibo.avvoltoio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import it.unibo.avvoltoio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChannelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Channel.class);
        Channel channel1 = new Channel();
        channel1.setId("id1");
        Channel channel2 = new Channel();
        channel2.setId(channel1.getId());
        assertThat(channel1).isEqualTo(channel2);
        channel2.setId("id2");
        assertThat(channel1).isNotEqualTo(channel2);
        channel1.setId(null);
        assertThat(channel1).isNotEqualTo(channel2);
    }
}
