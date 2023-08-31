package it.unibo.avvoltoio.service.dto;

import it.unibo.avvoltoio.domain.Channel;
import it.unibo.avvoltoio.domain.ChannelUser;
import java.util.List;

public class ChannelDTO {

    private Channel channel;

    private List<ChannelUser> users;

    public Channel getChannel() {
        return channel;
    }

    public void setChannel(Channel channel) {
        this.channel = channel;
    }

    public List<ChannelUser> getUsers() {
        return users;
    }

    public void setUsers(List<ChannelUser> users) {
        this.users = users;
    }
}
