package it.unibo.avvoltoio.service;

import it.unibo.avvoltoio.domain.Channel;
import it.unibo.avvoltoio.domain.ChannelUser;
import it.unibo.avvoltoio.domain.DmUser;
import it.unibo.avvoltoio.domain.Squeal;
import it.unibo.avvoltoio.domain.SquealDestination;
import it.unibo.avvoltoio.domain.SquealReaction;
import it.unibo.avvoltoio.domain.SquealViews;
import it.unibo.avvoltoio.domain.User;
import it.unibo.avvoltoio.domain.enumeration.ChannelTypes;
import it.unibo.avvoltoio.repository.ChannelRepository;
import it.unibo.avvoltoio.repository.ChannelUserRepository;
import it.unibo.avvoltoio.repository.DMUserRepository;
import it.unibo.avvoltoio.repository.SquealCatRepository;
import it.unibo.avvoltoio.repository.SquealReactionRepository;
import it.unibo.avvoltoio.repository.SquealRepository;
import it.unibo.avvoltoio.repository.SquealViewsRepository;
import it.unibo.avvoltoio.repository.UserCharsRepository;
import it.unibo.avvoltoio.security.SecurityUtils;
import it.unibo.avvoltoio.service.dto.ChannelDTO;
import it.unibo.avvoltoio.service.dto.ReactionDTO;
import it.unibo.avvoltoio.service.dto.SquealDTO;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SquealService {

    public static final Comparator<ReactionDTO> reactionsByNumber = Comparator.comparing(ReactionDTO::getNumber);

    @Autowired
    private UserService userService;

    @Autowired
    private ChannelService channelService;

    @Autowired
    private UserCharsService userCharsService;

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

    @Autowired
    private DMUserRepository dmUserRepository;

    @Autowired
    private UserCharsRepository userCharsRepository;

    public SquealDTO getSqueal(String id) {
        Squeal s = squealRepository.findById(id).orElseThrow(NullPointerException::new);

        return loadSquealData(s);
    }

    public List<String> getSquealDestination(String name) {
        if (name.startsWith("@")) {
            return getSquealUser(name);
        }
        List<Channel> ch = channelService.getChannelNames(name);
        return ch.stream().map(Channel::getName).toList();
    }

    private List<String> getSquealUser(String name) {
        List<String> retUsers = new ArrayList<>();
        List<User> us = userService.getUsersByName(name.substring(1));
        for (User u : us) {
            retUsers.add("@" + u.getLogin());
        }
        return retUsers;
    }

    public SquealDTO loadSquealData(Squeal sq) {
        if (sq == null) {
            return null;
        }
        SquealDTO s = new SquealDTO();
        s.setSqueal(sq);
        s.setCategory(squealCatRepository.findFirstBySquealId(sq.getId()).orElse(null));

        s.setReactions(getReactions(sq));

        s.setViews(addView(sq));

        s.setUserName(userService.getUserById(sq.getUserId()).map(User::getLogin).orElse(null));

        return s;
    }

    public List<ReactionDTO> getReactions(Squeal sq) {
        String cUid = getCurrentUserId();

        Map<String, ReactionDTO> map = new HashMap<>();

        List<SquealReaction> rList = squealReactionRepository.findAllBySquealId(sq.getId());

        for (SquealReaction sr : rList) {
            ReactionDTO r = map.computeIfAbsent(sr.getEmoji(), k -> new ReactionDTO(k));
            r.setNumber(r.getNumber() + 1);
            r.setUser(cUid.equals(sr.getUserId()));
        }

        return map.values().stream().sorted(reactionsByNumber).toList();
    }

    public List<SquealDTO> getSquealsList(int page, int number) {
        if (!SecurityUtils.isAuthenticated()) {
            return getAnonymousSqueals();
        } else {
            return getUserSqueals(page, number);
        }
    }

    public List<SquealDTO> getUserSqueals(int page, int number) {
        Pageable p = PageRequest.of(page, number);

        List<ChannelUser> myChannels = channelUserRepository.findAllByUserId(getCurrentUserId());

        List<String> destIds = myChannels.stream().map(ChannelUser::getChannelId).collect(Collectors.toList());

        List<Squeal> mySqueals = squealRepository.findAllByDestinations_DestinationIdInOrderByTimestampDesc(destIds, p);

        List<SquealDTO> ret = new ArrayList<>();
        for (Squeal s : mySqueals) {
            ret.add(loadSquealData(s));
        }

        return ret;
    }

    public List<SquealDTO> getAnonymousSqueals() {
        // TODO Return public stuff
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
            ChannelDTO dto = channelService.getChannelByName(sd.getDestination());
            if (dto == null && sd.getDestinationType() != ChannelTypes.MESSAGE) {
                if (sd.getDestinationType() != ChannelTypes.PUBLICGROUP) {
                    continue;
                }
                dto = channelService.createChannel(sd.getDestination());
            }
            String destinationId = dto.getChannel().getId();
            if (channelService.isUserInChannel(destinationId)) {
                sd.setDestinationId(destinationId);
                validDest.add(sd);
            }
            if (sd.getDestinationType() == ChannelTypes.MESSAGE) {
                String user = StringUtils.remove(sd.getDestination(), '@');
                User u = userService.getUserWithAuthoritiesByLogin(user).orElse(null);
                if (u != null) {
                    sd.setDestinationId(destinationId);
                    validDest.add(sd);
                }
            }
        }

        s.getDestinations().clear();
        s.setTimestamp(System.currentTimeMillis());
        s.setUserId(userService.getUserWithAuthorities().map(User::getId).orElseThrow(NullPointerException::new));
        s.setnCharacters(getNumberOfCharacters(s));

        s = squealRepository.save(s);

        // TODO: Destinations added after save (id problem), maybe generate UUID and
        // insert
        s.setDestinations(validDest);

        s = squealRepository.save(s);

        return getSqueal(s.getId());
    }

    private SquealViews addView(Squeal s) {
        Optional<SquealViews> v = squealViewsRepository.findFirstBySquealId(s.getId());
        boolean addView = !getCurrentUserId().equals(s.getUserId());
        if (v.isPresent()) {
            if (addView) {
                v.get().addView();
                return squealViewsRepository.save(v.get());
            }
            return v.get();
        } else {
            SquealViews sw = new SquealViews();
            sw.setNumber(1);
            sw.setSquealId(s.getId());
            return squealViewsRepository.save(sw);
        }
    }

    private Integer getNumberOfCharacters(Squeal s) {
        // TODO Controllare img + se destinations solo message

        return Optional.ofNullable(s.getBody()).map(String::length).orElse(0);
    }

    public String getCurrentUserId() {
        return userService.getUserWithAuthorities().map(User::getId).orElse("anonymous");
    }

    public List<SquealDTO> getDirectSqueal() {
        List<Squeal> mySqueals = squealRepository.findAllByDestinations_DestinationIdOrderByUserId(getCurrentUserId());
        List<SquealDTO> ret = new ArrayList<>();
        for (Squeal s : mySqueals) {
            ret.add(loadSquealData(s));
        }
        return ret;
    }

    public List<SquealDTO> getDirectSquealPreview() {
        List<DmUser> test = dmUserRepository.findDirectMessageUser(getCurrentUserId());
        List<SquealDTO> ret = new ArrayList<>();
        List<Squeal> mySqueals = squealRepository.findAllByDestinations_DestinationIdOrderByUserId(getCurrentUserId());

        Map<String, Squeal> lastSqualsByUser = mySqueals
            .stream()
            .collect(
                Collectors.toMap(
                    Squeal::getUserId,
                    Function.identity(),
                    (s1, s2) -> {
                        if (s1.getTimestamp() > s2.getTimestamp()) {
                            return s1;
                        }
                        return s2;
                    }
                )
            );
        for (Squeal s : lastSqualsByUser.values()) {
            ret.add(loadSquealData(s));
        }

        return ret;
    }

    public List<SquealDTO> getSquealByUser(String userId) {
        List<Squeal> squealsReceived = new ArrayList<>();
        if (!getCurrentUserId().equals(userId)) {
            squealsReceived = squealRepository.findAllByUserIdAndDestinations_DestinationIdOrderByTimestamp(userId, getCurrentUserId());
        }
        List<Squeal> squealsSent = squealRepository.findAllByUserIdAndDestinations_DestinationIdOrderByTimestamp(
            getCurrentUserId(),
            userId
        );
        List<SquealDTO> ret = new ArrayList<>();
        List<Squeal> merge = new ArrayList<>();
        merge.addAll(squealsReceived);
        merge.addAll(squealsSent);
        merge.stream().sorted(Comparator.comparing(Squeal::getTimestamp)).collect(Collectors.toList());
        for (Squeal s : merge) {
            ret.add(loadSquealData(s));
        }
        return ret;
    }

    public List<SquealDTO> getSquealByChannel(String channelId, int page, int number) {
        Pageable p = PageRequest.of(page, number);
        List<String> id = new ArrayList<>();
        id.add(channelId);
        List<SquealDTO> ret = new ArrayList<>();
        List<Squeal> mySqueals = new ArrayList<>();
        if (channelService.isUserInChannel(channelId)) {
            mySqueals = squealRepository.findAllByDestinations_DestinationIdInOrderByTimestampDesc(id, p);
        }
        for (Squeal s : mySqueals) {
            ret.add(loadSquealData(s));
        }
        return ret;
    }
}
