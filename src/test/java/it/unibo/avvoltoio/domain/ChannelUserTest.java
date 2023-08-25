package it.unibo.avvoltoio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import it.unibo.avvoltoio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChannelUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChannelUser.class);
        ChannelUser channelUser1 = new ChannelUser();
        channelUser1.setId("id1");
        ChannelUser channelUser2 = new ChannelUser();
        channelUser2.setId(channelUser1.getId());
        assertThat(channelUser1).isEqualTo(channelUser2);
        channelUser2.setId("id2");
        assertThat(channelUser1).isNotEqualTo(channelUser2);
        channelUser1.setId(null);
        assertThat(channelUser1).isNotEqualTo(channelUser2);
    }
}
