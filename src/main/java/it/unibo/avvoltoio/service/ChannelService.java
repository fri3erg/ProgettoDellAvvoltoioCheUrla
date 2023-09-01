package it.unibo.avvoltoio.service;

import it.unibo.avvoltoio.domain.Channel;
import it.unibo.avvoltoio.domain.ChannelUser;
import it.unibo.avvoltoio.domain.User;
import it.unibo.avvoltoio.domain.enumeration.ChannelTypes;
import it.unibo.avvoltoio.domain.enumeration.PrivilegeType;
import it.unibo.avvoltoio.repository.ChannelRepository;
import it.unibo.avvoltoio.repository.ChannelUserRepository;
import it.unibo.avvoltoio.security.SecurityUtils;
import it.unibo.avvoltoio.service.dto.ChannelDTO;
import it.unibo.avvoltoio.web.rest.errors.SquealException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChannelService {

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private ChannelUserRepository channelUserRepository;

    @Autowired
    private UserService userService;

    public List<ChannelDTO> searchChannels(String name) {
        List<ChannelDTO> retList = new ArrayList<>();
        List<Channel> cList = channelRepository.findAllByNameContainsOrderByName(name);
        String currentUserId = getCurrentUserId();
        for (Channel c : cList) {
            ChannelDTO cDTO = loadUsers(c);
            boolean valid = true;
            if (c.getType() == ChannelTypes.PRIVATEGROUP) {
                valid = false;
                for (ChannelUser u : cDTO.getUsers()) {
                    if (u.getUserId().equals(currentUserId)) {
                        valid = true;
                        break;
                    }
                }
            }
            if (valid) {
                retList.add(cDTO);
            }
        }
        return retList;
    }

    public ChannelDTO getChannel(String id) {
        Channel c = channelRepository.findById(id).orElse(null);
        return loadUsers(c);
    }

    public ChannelDTO getChannelByName(String name) {
        Channel c = channelRepository.findFirstByName(name).orElse(null);
        return loadUsers(c);
    }

    public ChannelDTO createChannel(String name) {
        ChannelDTO dto = new ChannelDTO();

        Channel c = new Channel();
        c.setName(name);
        dto.setChannel(c);
        return insertOrUpdateChannel(dto);
    }

    public ChannelDTO insertOrUpdateChannel(ChannelDTO channel) {
        Channel c = channel.getChannel();

        c.setType(ChannelTypes.getChannelType(c.getName()));

        if (c.getType() == null) {
            throw new SquealException("Channel name " + c.getName() + " is invalid");
        }
        if (c.getType() == ChannelTypes.MOD && !SecurityUtils.isCurrentUserMod()) {
            throw new SquealException("channel " + c.getName() + " is reserved");
        }

        // check if exist
        Optional<Channel> cc = channelRepository.findFirstByName(c.getName());
        if (cc.isPresent() && !cc.get().getId().equals(c.getId())) {
            throw new SquealException("Channel name " + c.getName() + " already exist");
        }

        boolean createOwner = (c.getId() == null);
        c = channelRepository.save(c);

        if (createOwner) {
            ChannelUser user = new ChannelUser();
            user.setUserId(getCurrentUserId());
            user.setChannelId(c.getId());
            user.setPrivilege(PrivilegeType.ADMIN);
            channelUserRepository.save(user);
        }

        return loadUsers(c);
    }

    private String getCurrentUserId() {
        return userService.getUserWithAuthorities().map(User::getId).orElseThrow(NullPointerException::new);
    }

    public ChannelDTO loadUsers(Channel channel) {
        if (channel == null) {
            return null;
        }
        ChannelDTO c = new ChannelDTO();
        c.setChannel(channel);
        c.setUsers(channelUserRepository.findAllByChannelId(c.getChannel().getId()));
        return c;
    }
}
