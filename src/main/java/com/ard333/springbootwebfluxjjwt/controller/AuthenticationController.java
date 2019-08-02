package com.ard333.springbootwebfluxjjwt.controller;

import com.ard333.springbootwebfluxjjwt.security.JWTUtil;
import com.ard333.springbootwebfluxjjwt.security.PBKDF2Encoder;
import com.ard333.springbootwebfluxjjwt.security.model.AuthRequest;
import com.ard333.springbootwebfluxjjwt.security.model.AuthResponse;
import com.ard333.springbootwebfluxjjwt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import javax.validation.Valid;
import javax.validation.Validator;

/**
 *
 * @author ard333
 */
@RestController
public class AuthenticationController {

	@Autowired
	private JWTUtil jwtUtil;
	
	@Autowired
	private PBKDF2Encoder passwordEncoder;

	@Autowired
	private UserService userService;

	@PostMapping("/login")
	public Mono<ResponseEntity<?>> login(@RequestBody @Valid AuthRequest ar) {
		return userService.findByEmail(ar.getEmail()).map((userDetails) -> {
			if (passwordEncoder.encode(ar.getPassword()).equals(userDetails.getPassword())) {
				return ResponseEntity.ok(new AuthResponse(jwtUtil.generateToken(userDetails)));
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
		}).defaultIfEmpty(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
	}
	
}
