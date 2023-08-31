package it.unibo.avvoltoio.domain.enumeration;

/**
 * The ChannelTypes enumeration.
 */
public enum ChannelTypes {
    PRIVATEGROUP,
    PUBLICGROUP,
    MOD,
    MESSAGE;

    public static ChannelTypes getChannelType(String name) {
        if (name == null) {
            return null;
        }

        if (name.startsWith("@")) {
            return ChannelTypes.MESSAGE;
        }
        if (name.startsWith("#")) {
            return ChannelTypes.PUBLICGROUP;
        }
        if (name.startsWith("§")) {
            if (isAllUpperCase(name)) {
                return ChannelTypes.MOD;
            }
            if (isAllLowerCase(name)) {
                return ChannelTypes.PRIVATEGROUP;
            }
        }

        return null;
    }

    public static boolean isAllUpperCase(String value) {
        if (value == null) {
            return false;
        }
        return value.toUpperCase().equals(value);
    }

    public static boolean isAllLowerCase(String value) {
        if (value == null) {
            return false;
        }
        return value.toLowerCase().equals(value);
    }
}
