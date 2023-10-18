package it.unibo.avvoltoio.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.unibo.avvoltoio.domain.SMMUser;
import it.unibo.avvoltoio.domain.SMMVIP;
import it.unibo.avvoltoio.domain.User;
import it.unibo.avvoltoio.repository.SMMVIPRepository;

@Service
public class SMMVIPService {
	
    @Autowired
    private SMMVIPRepository smmvipRepository;
    
    @Autowired
    private UserService userService;
    
    
    public String getCurrentUserId() {
        return userService.getUserWithAuthorities().map(User::getId).orElseThrow(NullPointerException::new);
    }

	public SMMVIP addSMM(String id) {
		Optional<SMMVIP> smmvip = smmvipRepository.findFirstByUserId(id);
	
		if(smmvip.isPresent()) {
		SMMUser smmUser = new SMMUser();
		smmUser.setUserId(getCurrentUserId());
		
		smmvip.get().addUsers(smmUser);
		smmvipRepository.save(smmvip.get());
		}
		return smmvip.get();
	}
}