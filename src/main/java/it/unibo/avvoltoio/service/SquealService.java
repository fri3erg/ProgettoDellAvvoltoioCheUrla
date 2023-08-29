package it.unibo.avvoltoio.service;

import it.unibo.avvoltoio.domain.Squeal;
import it.unibo.avvoltoio.domain.SquealDestination;
import it.unibo.avvoltoio.domain.User;
import it.unibo.avvoltoio.domain.enumeration.ChannelTypes;
import it.unibo.avvoltoio.repository.SquealCatRepository;
import it.unibo.avvoltoio.repository.SquealReactionRepository;
import it.unibo.avvoltoio.repository.SquealRepository;
import it.unibo.avvoltoio.repository.SquealViewsRepository;
import it.unibo.avvoltoio.security.AuthoritiesConstants;
import it.unibo.avvoltoio.security.SecurityUtils;
import it.unibo.avvoltoio.service.dto.SquealDTO;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SquealService {

    @Autowired
    private UserService userService;

    @Autowired
    private SquealRepository squealRepository;

    @Autowired
    private SquealCatRepository squealCatRepository;

    @Autowired
    private SquealReactionRepository squealReactionRepository;

    @Autowired
    private SquealViewsRepository squealViewsRepository;

    public SquealDTO getSqueal(String id) {
        SquealDTO s = new SquealDTO();
        s.setSqueal(squealRepository.findById(id).orElseThrow(NullPointerException::new));

        if (s.getSqueal() == null) {
            return null;
        }

        s.setCategory(squealCatRepository.findFirstBySquealId(id).orElse(null));

        s.setReactions(squealReactionRepository.findAllBySquealId(id));

        s.setViews(squealViewsRepository.findFirstBySquealId(id).orElse(null));

        return s;
    }

    public SquealDTO insertOrUpdate(SquealDTO squeal) {
        Squeal s = squeal.getSqueal();
        Set<SquealDestination> validDest = new HashSet<>();
        for (SquealDestination sd : s.getDestinations()) {
            sd.setDestinationType(ChannelTypes.getDestinationType(sd.getDestination()));
            if (sd.getDestinationType() == null) {
                continue;
            }
            boolean valid = false;
            switch (sd.getDestinationType()) {
                case MOD:
                    valid = isCurrentUserMod();
                    break;
                case PRIVATEGROUP:
                    valid = isCurrentUserInChannel(sd.getDestination());
                    break;
                case MESSAGE, PUBLICGROUP:
                    valid = true;
                    break;
                default:
                //do nothing
            }
            if (valid) {
                validDest.add(sd);
            }
        }

        s.getDestinations().clear();
        s.setTimestamp(System.currentTimeMillis());
        s.setUserId(userService.getUserWithAuthorities().map(User::getId).orElseThrow(NullPointerException::new));
        s.setnCharacters(getNumberOfCharacters(s));

        s = squealRepository.save(s);

        //TODO: Destinations added after save (id problem), maybe generate UUID and insert
        s.setDestinations(validDest);

        s = squealRepository.save(s);

        return getSqueal(s.getId());
    }

    private Integer getNumberOfCharacters(Squeal s) {
        // TODO Controllare img  + se destinations solo message

        return Optional.ofNullable(s.getBody()).map(String::length).orElse(0);
    }

    private boolean isCurrentUserInChannel(String destination) {
        // TODO da fare
        return true;
    }

    private boolean isCurrentUserMod() {
        return SecurityUtils.hasCurrentUserAnyOfAuthorities(AuthoritiesConstants.ADMIN);
    }
}
