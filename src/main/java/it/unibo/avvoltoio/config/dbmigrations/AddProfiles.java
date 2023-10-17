package it.unibo.avvoltoio.config.dbmigrations;

import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import it.unibo.avvoltoio.domain.Authority;
import it.unibo.avvoltoio.security.AuthoritiesConstants;
import org.springframework.data.mongodb.core.MongoTemplate;

/**
 * Creates the initial database setup.
 */
@ChangeUnit(id = "users-profiles", order = "002")
public class AddProfiles {

    private final MongoTemplate template;

    public AddProfiles(MongoTemplate template) {
        this.template = template;
    }

    @Execution
    public void changeSet() {
        Authority smmAuthority = createSMMAuthority();
        smmAuthority = template.save(smmAuthority);
        Authority vipAuthority = createVIPAuthority();
        vipAuthority = template.save(vipAuthority);
    }

    @RollbackExecution
    public void rollback() {}

    private Authority createAuthority(String authority) {
        Authority adminAuthority = new Authority();
        adminAuthority.setName(authority);
        return adminAuthority;
    }

    private Authority createVIPAuthority() {
        return createAuthority(AuthoritiesConstants.VIP);
    }

    private Authority createSMMAuthority() {
        return createAuthority(AuthoritiesConstants.SMM);
    }
}
