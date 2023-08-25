package it.unibo.avvoltoio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import it.unibo.avvoltoio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CharactersPurchasedTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CharactersPurchased.class);
        CharactersPurchased charactersPurchased1 = new CharactersPurchased();
        charactersPurchased1.setId("id1");
        CharactersPurchased charactersPurchased2 = new CharactersPurchased();
        charactersPurchased2.setId(charactersPurchased1.getId());
        assertThat(charactersPurchased1).isEqualTo(charactersPurchased2);
        charactersPurchased2.setId("id2");
        assertThat(charactersPurchased1).isNotEqualTo(charactersPurchased2);
        charactersPurchased1.setId(null);
        assertThat(charactersPurchased1).isNotEqualTo(charactersPurchased2);
    }
}
