package com.ard333.springbootwebfluxjjwt.service;

import com.ard333.springbootwebfluxjjwt.exception.BadRequestException;
import com.ard333.springbootwebfluxjjwt.model.AppUser;
import com.ard333.springbootwebfluxjjwt.model.AppUserDetail;
import com.ard333.springbootwebfluxjjwt.model.AuthProvider;
import com.ard333.springbootwebfluxjjwt.model.UserPrincipal;
import com.ard333.springbootwebfluxjjwt.repository.UserRepository;

import com.ard333.springbootwebfluxjjwt.security.PBKDF2Encoder;
import com.ard333.springbootwebfluxjjwt.security.model.Role;
import com.ard333.springbootwebfluxjjwt.security.model.SignUpRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import reactor.core.publisher.Mono;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;

/**
 * @author ard333
 */
@Service
public class UserService {
	
	// this is just an example, you can load the user from the database from the repository
	@Autowired
	private PBKDF2Encoder passwordEncoder;
	@Autowired
	private UserRepository userRepository;
	
	
	
	public Mono<UserPrincipal> findByEmail(String email) {
		AppUser appUser = userRepository.findByEmail(email).orElseThrow(
				() -> new EntityNotFoundException("Can't find user in DB.")
		);
		return Mono.just(UserPrincipal.create(appUser));
	}
	
	@Transactional
	public Mono<AppUser> registerUser(@RequestBody @Valid SignUpRequest signUpRequest) {
		checkUsernameAndEmail(signUpRequest);
		final AppUserDetail appUserDetail = new AppUserDetail(
				signUpRequest.getFirstName(),
				signUpRequest.getLastName(),
				null,
				false
		);
		appUserDetail.setDate(signUpRequest.getDate());
		
		AppUser appUser = new AppUser(
				signUpRequest.getUsername(),
				signUpRequest.getEmail(),
				appUserDetail,
				Role.ROLE_USER,
				AuthProvider.local
		);
		appUser.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
		return Mono.just(userRepository.save(appUser));
	}
	
	public void checkUsernameAndEmail(@RequestBody @Valid SignUpRequest signUpRequest) {
		if(userRepository.existsByEmailOrUsername(signUpRequest.getEmail(),signUpRequest.getUsername())) {
			throw new BadRequestException("Email or username is already in use.");
		}
	}
}
