package it.unibo.avvoltoio.service;

import it.unibo.avvoltoio.domain.Channel;
import it.unibo.avvoltoio.domain.ChannelUser;
import it.unibo.avvoltoio.domain.Squeal;
import it.unibo.avvoltoio.domain.SquealDestination;
import it.unibo.avvoltoio.domain.SquealReaction;
import it.unibo.avvoltoio.domain.SquealViews;
import it.unibo.avvoltoio.domain.User;
import it.unibo.avvoltoio.domain.enumeration.ChannelTypes;
import it.unibo.avvoltoio.repository.ChannelUserRepository;
import it.unibo.avvoltoio.repository.SquealCatRepository;
import it.unibo.avvoltoio.repository.SquealReactionRepository;
import it.unibo.avvoltoio.repository.SquealRepository;
import it.unibo.avvoltoio.repository.SquealViewsRepository;
import it.unibo.avvoltoio.repository.UserRepository;
import it.unibo.avvoltoio.security.SecurityUtils;
import it.unibo.avvoltoio.service.dto.AdminUserDTO;
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
    private ChannelUserRepository channelUserRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SquealRepository squealRepository;

    @Autowired
    private SquealCatRepository squealCatRepository;

    @Autowired
    private SquealReactionRepository squealReactionRepository;

    @Autowired
    private SquealViewsRepository squealViewsRepository;

    public SquealDTO getSqueal(String id, String userId) {
        Squeal s = squealRepository.findById(id).orElseThrow(NullPointerException::new);

        return loadSquealData(s, userId);
    }

    public List<String> getSquealDestination(String name, String id) {
        if (name.startsWith("@")) {
            return getSquealUser(name);
        }
        List<String> ret = new ArrayList<>();

        if (name.startsWith("#")) {
            ret.add(name);
            return ret;
        }

        List<Channel> ch = channelService.getChannelNames(name);
        for (Channel channel : ch) {
            if (channelService.canUserWrite(channel.getId(), id)) {
                ret.add(channel.getName());
            }
        }
        return ret;
    }

    private List<String> getSquealUser(String name) {
        List<String> retUsers = new ArrayList<>();
        List<AdminUserDTO> us = userService.getUsersByName(name.substring(1));
        for (AdminUserDTO u : us) {
            retUsers.add("@" + u.getLogin());
        }
        return retUsers;
    }

    public SquealDTO loadSquealData(Squeal sq, String id) {
        if (sq == null) {
            return null;
        }
        SquealDTO s = new SquealDTO();
        s.setSqueal(sq);
        s.setCategory(squealCatRepository.findFirstBySqueal_id(sq.getId()).orElse(null));

        s.setReactions(getReactions(sq.getId()));

        s.setViews(addView(sq, id));

        s.setUserName(userService.getUserById(sq.getUser_id()).map(User::getLogin).orElse(null));

        return s;
    }

    public List<ReactionDTO> getReactions(String sq) {
        Map<String, ReactionDTO> map = new HashMap<>();

        List<SquealReaction> rList = squealReactionRepository.findAllBySquealId(sq);

        for (SquealReaction sr : rList) {
            ReactionDTO r = map.computeIfAbsent(sr.getEmoji(), k -> new ReactionDTO(k));
            r.setNumber(r.getNumber() + 1);
            // r.setUser(cUid.equals(sr.getUserId()));
        }

        return map.values().stream().sorted(reactionsByNumber).toList();
    }

    public List<SquealDTO> getSquealsList(int page, int number, String id) {
        if (!SecurityUtils.isAuthenticated()) {
            return getAnonymousSqueals();
        } else {
            return getUserSqueals(page, number, id);
        }
    }

    public List<SquealDTO> getUserSqueals(int page, int number, String id) {
        List<SquealDTO> ret = new ArrayList<>();

        if (isUserAuthorized(id)) {
            Pageable p = PageRequest.of(page, number);

            List<ChannelUser> myChannels = channelUserRepository.findAllByUser_id(id);

            List<String> destIds = myChannels.stream().map(ChannelUser::getChannel_id).collect(Collectors.toList());

            List<Squeal> mySqueals = squealRepository.findAllByDestinations_Destination_idInOrderByTimestampDesc(destIds, p);
            for (Squeal s : mySqueals) {
                ret.add(loadSquealData(s, id));
            }
        }
        return ret;
    }

    public List<SquealDTO> getAnonymousSqueals() {
        // TODO Return public stuff
        return null;
    }

    public SquealDTO insertOrUpdate(SquealDTO squeal, String id) {
        if (isUserAuthorized(id)) {
            Squeal s = squeal.getSqueal();
            Set<SquealDestination> validDest = new HashSet<>();
            for (SquealDestination sd : s.getDestinations()) {
                sd.setDestination_type(ChannelTypes.getChannelType(sd.getDestination()));
                if (sd.getDestination_type() == null) {
                    continue;
                }

                String destinationId = null;
                switch (sd.getDestination_type()) {
                    case MESSAGE:
                        destinationId = getDestinationIdMessage(sd);
                        break;
                    case MOD, PRIVATEGROUP, PUBLICGROUP:
                        destinationId = getDestinationIdChannel(sd, id);
                        break;
                    default:
                    // do nothing
                }

                if (destinationId == null) {
                    continue;
                }
                sd.setDestinationId(destinationId);
                validDest.add(sd);
            }
            if (!validDest.isEmpty()) {
                s.getDestinations().clear();
                s.setTimestamp(System.currentTimeMillis());
                s.setUser_id(id);
                // s.setUserId(userService.getUserWithAuthorities().map(User::getId).orElseThrow(NullPointerException::new));
                s.setN_characters(getNumberOfCharacters(s));

                //TODO: Check image size
                s.setImg(resizeImg(s.getImg()));
                s = squealRepository.save(s);

                // TODO: Destinations added after save (id problem), maybe generate UUID and
                // insert
                s.setDestinations(validDest);

                s = squealRepository.save(s);

                return getSqueal(s.getId(), id);
            }
        }
        return null;
    }

    private byte[] resizeImg(byte[] img) {
        return img;
    }

    private String getDestinationIdChannel(SquealDestination sd, String id) {
        ChannelDTO dto = channelService.getChannelByName(sd.getDestination());

        // create channel too if public and not exist
        if (dto == null && sd.getDestination_type() == ChannelTypes.PUBLICGROUP) {
            dto = channelService.createChannel(sd.getDestination(), id);
            return dto.getChannel().getId();
        }

        // Check for channel type if user allowed to write
        if (dto != null && channelService.canUserWrite(dto.getChannel().getId(), id)) {
            return dto.getChannel().getId();
        }
        return null;
    }

    private String getDestinationIdMessage(SquealDestination sd) {
        String user = StringUtils.remove(sd.getDestination(), '@');
        return userService.getUserWithAuthoritiesByLogin(user).map(User::getId).orElse(null);
    }

    private SquealViews addView(Squeal s, String id) {
        Optional<SquealViews> v = squealViewsRepository.findFirstBySqueal_id(s.getId());
        // add or smm for no views
        boolean addView = !id.equals(s.getUser_id());
        if (v.isPresent()) {
            if (addView) {
                v.get().addView();
                return squealViewsRepository.save(v.get());
            }
            return v.get();
        } else {
            SquealViews sw = new SquealViews();
            sw.setNumber(1);
            sw.setSqueal_id(s.getId());
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

    public List<SquealDTO> getDirectSqueal(String id) {
        List<SquealDTO> ret = new ArrayList<>();

        if (isUserAuthorized(id)) {
            List<Squeal> mySqueals = squealRepository.findAllByDestinations_DestinationIdOrderByUser_id(id);

            for (Squeal s : mySqueals) {
                ret.add(loadSquealData(s, id));
            }
        }
        return ret;
    }

    private boolean isUserAuthorized(String id) {
        // add for smm
        return id.equals(getCurrentUserId());
    }

    public List<SquealDTO> getDirectSquealPreview(String id) {
        List<SquealDTO> ret = new ArrayList<>();
        if (isUserAuthorized(id)) {
            List<Squeal> mySqueals = squealRepository.findAllByDestinations_DestinationIdOrderByUser_id(id);

            Map<String, Squeal> lastSqualsByUser = mySqueals
                .stream()
                .collect(
                    Collectors.toMap(
                        Squeal::getUser_id,
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
                ret.add(loadSquealData(s, id));
            }
        }

        return ret;
    }

    public List<SquealDTO> getSquealByUser(int page, int number, String userName, String myId) {
        String userId = userRepository.findOneByLogin(userName).map(User::getId).orElse("");
        List<SquealDTO> ret = new ArrayList<>();
        if (isUserAuthorized(myId)) {
            Pageable p = PageRequest.of(page, number);
            List<Squeal> squealsReceived = new ArrayList<>();
            if (!myId.equals(userId)) {
                squealsReceived = squealRepository.findAllByUser_idAndDestinations_Destination_idOrderByTimestamp(userId, myId, p);
            }
            List<Squeal> squealsSent = squealRepository.findAllByUser_idAndDestinations_Destination_idOrderByTimestamp(myId, userId, p);
            List<Squeal> merge = new ArrayList<>();
            merge.addAll(squealsReceived);
            merge.addAll(squealsSent);
            merge.stream().sorted(Comparator.comparing(Squeal::getTimestamp)).toList();
            for (Squeal s : merge) {
                ret.add(loadSquealData(s, myId));
            }
        }
        return ret;
    }

    public List<SquealDTO> getSquealByChannel(String channelId, int page, int number, String myId) {
        Pageable p = PageRequest.of(page, number);
        List<String> id = new ArrayList<>();
        id.add(channelId);
        List<SquealDTO> ret = new ArrayList<>();
        List<Squeal> mySqueals = new ArrayList<>();
        if (channelService.canUserWrite(channelId, myId)) {
            mySqueals = squealRepository.findAllByDestinations_Destination_idInOrderByTimestampDesc(id, p);
        }
        for (Squeal s : mySqueals) {
            ret.add(loadSquealData(s, myId));
        }
        return ret;
    }

    public List<ReactionDTO> insertOrUpdateReaction(SquealReaction squealReaction, String id) {
        if (isUserAuthorized(id)) {
            Optional<SquealReaction> search = squealReactionRepository.findFirstByUserIdAndSquealId(
                squealReaction.getUser_id(),
                squealReaction.getSqueal_id()
            );
            if (search.isPresent()) {
                squealReactionRepository.deleteById(search.get().getId());
                if (search.get().getEmoji().equals(squealReaction.getEmoji())) {
                    return getReactions(squealReaction.getSqueal_id());
                }
            }
            squealReaction.setUsername(SecurityUtils.getCurrentUserLogin().orElse("unknown"));
            squealReaction.setUser_id(id);
            squealReactionRepository.save(squealReaction);
        }
        return getReactions(squealReaction.getSqueal_id());
    }

    public Long getChannelCount(String id) {
        return squealRepository.countByDestinations_Destination_id(id);
    }

    public List<SquealDTO> getSquealMadeByUser(String name, int page, int number) {
        List<SquealDTO> dto = new ArrayList<>();
        String userId = userRepository.findOneByLogin(name).map(User::getId).orElse("");
        Pageable p = PageRequest.of(page, number);
        List<Squeal> squeals = squealRepository.findAllByUser_id(userId, p);
        for (Squeal s : squeals) {
            dto.add(loadSquealData(s, name));
        }
        return dto;
    }

    public Long countSquealMadeByUser(String name) {
        String userId = userRepository.findOneByLogin(name).map(User::getId).orElse("");
        return squealRepository.countByUser_id(userId);
    }

    public Long getPositiveReactions(String id) {
        if (isUserAuthorized(id)) {
            List<Squeal> squeals = squealRepository.findAllByUser_id(id);
            List<String> ids = squeals.stream().map(Squeal::getId).toList();
            return squealReactionRepository.countBySquealIdAndPositive(ids, true);
        }
        return (long) 0;
    }
}
