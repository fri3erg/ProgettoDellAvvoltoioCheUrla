package it.unibo.avvoltoio.service;

import it.unibo.avvoltoio.domain.ChannelUser;
import it.unibo.avvoltoio.domain.Squeal;
import it.unibo.avvoltoio.domain.SquealDestination;
import it.unibo.avvoltoio.domain.User;
import it.unibo.avvoltoio.domain.enumeration.ChannelTypes;
import it.unibo.avvoltoio.repository.ChannelRepository;
import it.unibo.avvoltoio.repository.ChannelUserRepository;
import it.unibo.avvoltoio.repository.SquealCatRepository;
import it.unibo.avvoltoio.repository.SquealReactionRepository;
import it.unibo.avvoltoio.repository.SquealRepository;
import it.unibo.avvoltoio.repository.SquealViewsRepository;
import it.unibo.avvoltoio.security.SecurityUtils;
import it.unibo.avvoltoio.service.dto.ChannelDTO;
import it.unibo.avvoltoio.service.dto.SquealDTO;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SquealService {

    @Autowired
    private UserService userService;

    @Autowired
    private ChannelService channelService;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private ChannelUserRepository channelUserRepository;

    @Autowired
    private SquealRepository squealRepository;

    @Autowired
    private SquealCatRepository squealCatRepository;

    @Autowired
    private SquealReactionRepository squealReactionRepository;

    @Autowired
    private SquealViewsRepository squealViewsRepository;

    public SquealDTO getSqueal(String id) {
        Squeal s = squealRepository.findById(id).orElseThrow(NullPointerException::new);

        return loadSquealData(s);
    }

    public SquealDTO loadSquealData(Squeal sq) {
        if (sq == null) {
            return null;
        }
        SquealDTO s = new SquealDTO();
        s.setSqueal(sq);
        s.setCategory(squealCatRepository.findFirstBySquealId(sq.getId()).orElse(null));

        s.setReactions(squealReactionRepository.findAllBySquealId(sq.getId()));

        s.setViews(squealViewsRepository.findFirstBySquealId(sq.getId()).orElse(null));

        return s;
    }

    public List<SquealDTO> getSquealsList() {
        if (!SecurityUtils.isAuthenticated()) {
            return getAnonymousSqueals();
        } else {
            return getUserSqueals();
        }
    }

    public List<SquealDTO> getUserSqueals() {
        List<ChannelUser> myChannels = channelUserRepository.findAllByUserId(getCurrentUserId());

        List<String> destIds = myChannels.stream().map(ChannelUser::getChannelId).collect(Collectors.toList());

        List<Squeal> mySqueals = squealRepository.findAllByDestinations_DestinationIdInOrderByTimestampDesc(destIds, Pageable.ofSize(200));

        List<SquealDTO> ret = new ArrayList<>();
        for (Squeal s : mySqueals) {
            ret.add(loadSquealData(s));
        }

        return ret;
    }

    public List<SquealDTO> getAnonymousSqueals() {
        //TODO Return public stuff
        return null;
    }

    public SquealDTO insertOrUpdate(SquealDTO squeal) {
        Squeal s = squeal.getSqueal();
        Set<SquealDestination> validDest = new HashSet<>();
        for (SquealDestination sd : s.getDestinations()) {
            sd.setDestinationType(ChannelTypes.getChannelType(sd.getDestination()));
            if (sd.getDestinationType() == null) {
                continue;
            }
            boolean valid = false;
            String destinationId = null;
            switch (sd.getDestinationType()) {
                case MOD:
                    valid = SecurityUtils.isCurrentUserMod();
                    // TODO: Destination id
                    break;
                case PRIVATEGROUP:
                    ChannelDTO cp = channelService.getChannelByName(sd.getDestination());
                    valid = isCurrentUserInChannel(cp);
                    destinationId = cp.getChannel().getId();
                    break;
                case PUBLICGROUP:
                    ChannelDTO cPup = channelService.getChannelByName(sd.getDestination());
                    if (cPup == null) {
                        cPup = channelService.createChannel(sd.getDestination());
                    }
                    destinationId = cPup.getChannel().getId();
                    valid = true;
                    break;
                case MESSAGE:
                    String user = StringUtils.remove(sd.getDestination(), '@');
                    User u = userService.getUserWithAuthoritiesByLogin(user).orElse(null);
                    valid = u != null;
                    if (u != null) {
                        destinationId = u.getId();
                    }
                    break;
                default:
                //do nothing
            }
            if (valid) {
                sd.setDestinationId(destinationId);
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

    private boolean isCurrentUserInChannel(ChannelDTO channel) {
        String uid = getCurrentUserId();
        for (ChannelUser u : channel.getUsers()) {
            if (uid.equals(u.getUserId())) {
                return true;
            }
        }
        return false;
    }

    private String getCurrentUserId() {
        return userService.getUserWithAuthorities().map(User::getId).orElseThrow(NullPointerException::new);
    }
}
