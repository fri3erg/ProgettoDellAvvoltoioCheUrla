package it.unibo.avvoltoio.domain.enumeration;

import org.apache.commons.lang3.StringUtils;

/**
 * The ChannelTypes enumeration.
 */
public enum ChannelTypes {
    PRIVATEGROUP,
    PUBLICGROUP,
    MOD,
    MESSAGE;

    public static ChannelTypes getDestinationType(String destination) {
        if (destination == null) {
            return null;
        }

        if (destination.startsWith("@")) {
            return ChannelTypes.MESSAGE;
        }
        if (destination.startsWith("#")) {
            return ChannelTypes.PUBLICGROUP;
        }
        if (destination.startsWith("§")) {
            if (StringUtils.isAllUpperCase(destination)) {
                return ChannelTypes.MOD;
            }
            if (StringUtils.isAllLowerCase(destination)) {
                return ChannelTypes.PRIVATEGROUP;
            }
        }

        return null;
    }
}
