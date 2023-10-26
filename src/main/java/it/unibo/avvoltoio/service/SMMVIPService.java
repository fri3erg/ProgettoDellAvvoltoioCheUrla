package it.unibo.avvoltoio.service;

import it.unibo.avvoltoio.domain.SMMUser;
import it.unibo.avvoltoio.domain.SMMVIP;
import it.unibo.avvoltoio.domain.User;
import it.unibo.avvoltoio.repository.SMMVIPRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SMMVIPService {

    @Autowired
    private SMMVIPRepository smmvipRepository;

    @Autowired
    private UserService userService;

    public String getCurrentUserId() {
        return userService.getUserWithAuthorities().map(User::getId).orElseThrow(NullPointerException::new);
    }

    public SMMVIP addSMM(String id) {
        Optional<SMMVIP> smmvip = smmvipRepository.findFirstByUser__id(id);

        if (smmvip.isPresent()) {
            SMMUser smmUser = new SMMUser();
            smmUser.setUserId(getCurrentUserId());

            smmvip.get().addUsers(smmUser);
            smmvipRepository.save(smmvip.get());
        }
        return smmvip.get();
    }
}
