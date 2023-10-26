package it.unibo.avvoltoio.service;

import it.unibo.avvoltoio.domain.Channel;
import it.unibo.avvoltoio.domain.ChannelUser;
import it.unibo.avvoltoio.domain.User;
import it.unibo.avvoltoio.domain.enumeration.ChannelTypes;
import it.unibo.avvoltoio.domain.enumeration.PrivilegeType;
import it.unibo.avvoltoio.repository.ChannelRepository;
import it.unibo.avvoltoio.repository.ChannelUserRepository;
import it.unibo.avvoltoio.repository.UserRepository;
import it.unibo.avvoltoio.security.SecurityUtils;
import it.unibo.avvoltoio.service.dto.AdminUserDTO;
import it.unibo.avvoltoio.service.dto.ChannelDTO;
import it.unibo.avvoltoio.web.rest.errors.SquealException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChannelService {

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private ChannelUserRepository channelUserRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    public List<ChannelDTO> searchChannels(String name, String id) {
        List<ChannelDTO> retList = new ArrayList<>();
        if (isUserAuthorized(id)) {
            List<Channel> cList = channelRepository.findAllByNameContainsOrderByName(name);
            for (Channel c : cList) {
                ChannelDTO cDTO = loadUsers(c);
                switch (c.getType()) {
                    case PRIVATEGROUP:
                        {
                            if (isUserSubscribed(id, cDTO)) {
                                retList.add(cDTO);
                            }
                            break;
                        }
                    case MESSAGE:
                        {
                            break;
                        }
                    case MOD, PUBLICGROUP:
                        {
                            retList.add(cDTO);
                            break;
                        }
                    default:
                        throw new IllegalArgumentException("Unexpected value: " + c.getType());
                }
            }
        }
        return retList;
    }

    private boolean isUserSubscribed(String id, ChannelDTO cDTO) {
        return cDTO.getUsers().stream().anyMatch(c -> c.getUser_id() != null && c.getUser_id().equals(id));
        // return  cDTO.getUsers().stream().map(ChannelUser::getUserId).toList().contains(id);
    }

    public List<Channel> getChannelNames(String name) {
        return channelRepository.findAllByNameContainsOrderByName(name);
    }

    public ChannelDTO getChannel(String id) {
        Channel c = channelRepository.findById(id).orElse(null);
        return loadUsers(c);
    }

    public ChannelDTO getChannelByName(String name) {
        Channel c = channelRepository.findFirstByName(name).orElse(null);
        return loadUsers(c);
    }

    public ChannelDTO createChannel(String name, String id) {
        if (!isUserAuthorized(id)) {
            return null;
        }
        ChannelDTO dto = new ChannelDTO();

        Channel c = new Channel();
        c.setName(name);
        dto.setChannel(c);
        return insertOrUpdateChannel(dto, id);
    }

    public ChannelDTO insertOrUpdateChannel(ChannelDTO channel, String id) {
        Channel c = channel.getChannel();
        String channelName = c.getName();
        String channelId = c.getId();
        ChannelTypes channelType = c.getType();
        if (isIncorrectName(channelName)) {
            throw new SquealException("Channel name " + channelName + " is invalid");
        }
        c.setType(ChannelTypes.getChannelType(channelName));

        if (channelType == null) {
            throw new SquealException("Channel name " + channelName + " is invalid");
        }

        if (channelType == ChannelTypes.MOD && !SecurityUtils.isCurrentUserMod()) {
            throw new SquealException("channel " + channelName + " is reserved");
        }
        // check if exist
        Optional<Channel> cc = channelRepository.findFirstByName(channelName);

        if (cc.isPresent() && !cc.get().getId().equals(channelId)) {
            throw new SquealException("Channel name " + channelName + " already exist");
        }
        boolean createOwner = (channelId == null);

        c = channelRepository.save(c);
        // TODO : check createOwner
        if (createOwner) {
            ChannelUser user = new ChannelUser();
            user.setUser_id(id);
            user.setChannel_id(channelId);
            user.setPrivilege(PrivilegeType.ADMIN);
            channelUserRepository.save(user);
        }

        return loadUsers(c);
    }

    private boolean isIncorrectName(String name) {
        String q = name.substring(1);
        if (q.contains("§") || q.contains("#") || q.contains("@") || !q.toLowerCase().equals(q)) {
            return true;
        }
        return false;
    }

    public String getCurrentUserId() {
        return userService.getUserWithAuthorities().map(User::getId).orElseThrow(NullPointerException::new);
    }

    public ChannelDTO loadUsers(Channel channel) {
        if (channel == null) {
            return null;
        }
        ChannelDTO c = new ChannelDTO();
        c.setChannel(channel);
        c.setUsers(channelUserRepository.findAllByChannel__id(c.getChannel().getId()));
        return c;
    }

    public boolean isCurrentUserInChannel(ChannelDTO channel, String uid) {
        if (isUserAuthorized(uid)) {
            for (ChannelUser u : channel.getUsers()) {
                if (uid.equals(u.getUser_id())) {
                    return true;
                }
            }
        }
        return false;
    }

    private Boolean isUserAuthorized(String id) {
        // TODO add for smm
        return id.equals(getCurrentUserId());
    }

    public boolean canUserWrite(String id, String myId) {
        Channel channel = channelRepository.findFirstById(id);
        boolean valid = false;
        switch (channel.getType()) {
            case MOD:
                valid = SecurityUtils.isCurrentUserMod();
                // TODO: Destination id
                break;
            case PRIVATEGROUP:
                ChannelDTO dto = loadUsers(channel);
                valid = isCurrentUserInChannel(dto, myId);
                break;
            case PUBLICGROUP:
                valid = true;
                break;
            default:
            // do nothing
        }
        return valid;
    }

    public List<ChannelDTO> getSub(String name) {
        String userId = userRepository.findOneByLogin(name).map(User::getId).orElse("");
        List<ChannelDTO> channels = new ArrayList<>();
        List<ChannelUser> channeluser = channelUserRepository.findAllByUser__id(userId);
        Channel temp;
        for (ChannelUser c : channeluser) {
            temp = channelRepository.findFirstById(c.getChannel_id());
            if ((temp.getType() == ChannelTypes.PRIVATEGROUP && !isUserAuthorized(userId)) || temp.getType() == ChannelTypes.MESSAGE) {
                continue;
            }
            channels.add(loadUsers(temp));
        }
        return channels;
    }

    public Long countSub(String id) {
        return (long) getSub(id).size();
    }

    public Long getChannelSubsCount(String id) {
        return channelUserRepository.countByChannel__id(id);
    }

    public List<AdminUserDTO> getSubscribedToChannel(String id) {
        List<String> chUsers = channelUserRepository
            .findAllByChannel__id(id)
            .stream()
            .map(ChannelUser::getUser_id)
            .collect(Collectors.toList());

        return userRepository.findAllById(chUsers).stream().map(AdminUserDTO::new).collect(Collectors.toList());
    }
}
