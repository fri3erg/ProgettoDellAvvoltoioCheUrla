package it.unibo.avvoltoio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import it.unibo.avvoltoio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserCharsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserChars.class);
        UserChars userChars1 = new UserChars();
        userChars1.setId("id1");
        UserChars userChars2 = new UserChars();
        userChars2.setId(userChars1.getId());
        assertThat(userChars1).isEqualTo(userChars2);
        userChars2.setId("id2");
        assertThat(userChars1).isNotEqualTo(userChars2);
        userChars1.setId(null);
        assertThat(userChars1).isNotEqualTo(userChars2);
    }
}
