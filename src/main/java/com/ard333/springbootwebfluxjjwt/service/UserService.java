package com.ard333.springbootwebfluxjjwt.service;

import com.ard333.springbootwebfluxjjwt.model.AppUser;
import com.ard333.springbootwebfluxjjwt.model.AppUserDetail;
import com.ard333.springbootwebfluxjjwt.model.UserPrincipal;
import com.ard333.springbootwebfluxjjwt.repository.UserRepository;

import com.ard333.springbootwebfluxjjwt.security.PBKDF2Encoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import javax.persistence.EntityNotFoundException;

/**
 * @author ard333
 */
@Service
public class UserService {
	
	// this is just an example, you can load the user from the database from the repository
	@Autowired
	private PBKDF2Encoder passwordEncoder;
	//username:passwowrd -> user:user
	private final AppUser mockUser = new AppUser("user","user@user.com",new AppUserDetail("user","user",null,null));
	@Autowired
	private UserRepository userRepository;
	
	
	public Mono<UserPrincipal> findByEmail(String email) {
		if (email.equals(mockUser.getEmail())) {
			mockUser.setPassword(passwordEncoder.encode("user"));
			return Mono.just(UserPrincipal.createAdmin(mockUser));
		}
		AppUser appUser = userRepository.findByEmail(email).orElseThrow(
				() -> new EntityNotFoundException("Can't find user in DB.")
		);
		return Mono.just(UserPrincipal.create(appUser));
	}
}
