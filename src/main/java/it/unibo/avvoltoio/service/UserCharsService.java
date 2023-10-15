package it.unibo.avvoltoio.service;

import it.unibo.avvoltoio.domain.Squeal;
import it.unibo.avvoltoio.domain.SquealDestination;
import it.unibo.avvoltoio.domain.User;
import it.unibo.avvoltoio.domain.UserChars;
import it.unibo.avvoltoio.domain.enumeration.ChannelTypes;
import it.unibo.avvoltoio.repository.SquealRepository;
import it.unibo.avvoltoio.repository.UserCharsRepository;
import it.unibo.avvoltoio.service.dto.UserCharsDTO;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class UserCharsService {

    @Value("${app.max-chars.day}")
    Integer maxCharsDay = 20;

    @Value("${app.max-chars.week}")
    Integer maxCharsWeek = 60;

    @Value("${app.max-chars.month}")
    Integer maxCharsMonth = 400;

    public UserCharsService() {}

    @Autowired
    private SquealRepository squealRepository;

    @Autowired
    private UserCharsRepository userCharsRepository;

    @Autowired
    UserService userService;

    public Optional<UserChars> getCurrentUserChars(String id) {
        if (!isUserAuthorized(id)) {
            return null;
        }
        return userCharsRepository.findByUserId(id);
    }

    private Boolean isUserAuthorized(String id) {
        //add for smm
        return id.equals(getCurrentUserId());
    }

    public String getCurrentUserId() {
        return userService.getUserWithAuthorities().map(User::getId).orElseThrow(NullPointerException::new);
    }

    public UserCharsDTO calcChars(String userId) {
        UserCharsDTO usercharsDTO = new UserCharsDTO();

        long smTime = getStartOfMonth();
        long wkTime = getStartOfWeek();
        long dayTime = getStartOfDay();
        int totgg, totwk, totmth;
        totgg = totwk = totmth = 0;
        List<Squeal> mSqueals = squealRepository.findAllByUserIdAndTimestampGreaterThanOrderByTimestamp(userId, smTime);
        for (Squeal s : mSqueals) {
            boolean valid = false;
            Set<SquealDestination> dest = s.getDestinations();
            for (SquealDestination d : dest) {
                if (d.getDestinationType() != ChannelTypes.MESSAGE) {
                    valid = true;
                    break;
                }
            }
            if (valid) {
                long squealTime = s.getTimestamp();
                int nChars = Optional.ofNullable(s.getnCharacters()).orElse(0);
                if (squealTime >= dayTime) {
                    totgg = totgg + nChars;
                }
                if (squealTime >= wkTime) {
                    totwk = totwk + nChars;
                }
                totmth = totmth + nChars;
            }
        }
        int remMth, remWk, remDay, remTot;
        remMth = maxCharsMonth - totmth;
        remWk = maxCharsWeek - totwk;
        remDay = maxCharsDay - totgg;
        remTot = Math.min(remDay, Math.min(remWk, remMth));
        usercharsDTO.setRemainingChars(remTot);
        if (remTot == remDay) {
            usercharsDTO.setType(UserCharsDTO.Type.DAY);
        }
        if (remTot == remWk) {
            usercharsDTO.setType(UserCharsDTO.Type.WEEK);
        }
        if (remTot == remMth) {
            usercharsDTO.setType(UserCharsDTO.Type.MONTH);
        }

        return usercharsDTO;
    }

    private long getStartOfMonth() {
        Calendar date = new GregorianCalendar();
        date.set(Calendar.DAY_OF_MONTH, date.getActualMinimum(Calendar.DAY_OF_MONTH));
        setStartOfDay(date);
        long smTime = date.getTimeInMillis();
        return smTime;
    }

    private long getStartOfWeek() {
        Calendar date = new GregorianCalendar();
        date.set(Calendar.DAY_OF_WEEK, date.getActualMinimum(Calendar.DAY_OF_WEEK));
        setStartOfDay(date);
        long smTime = date.getTimeInMillis();
        return smTime;
    }

    private long getStartOfDay() {
        Calendar date = new GregorianCalendar();
        setStartOfDay(date);
        long smTime = date.getTimeInMillis();
        return smTime;
    }

    private void setStartOfDay(Calendar date) {
        date.set(Calendar.HOUR_OF_DAY, date.getActualMinimum(Calendar.HOUR_OF_DAY));
        date.set(Calendar.MINUTE, date.getActualMinimum(Calendar.MINUTE));
        date.set(Calendar.SECOND, date.getActualMinimum(Calendar.SECOND));
        date.set(Calendar.MILLISECOND, date.getActualMinimum(Calendar.MILLISECOND));
    }
}
