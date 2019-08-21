package com.ard333.springbootwebfluxjjwt.security;

import com.ard333.springbootwebfluxjjwt.model.UserPrincipal;
import com.ard333.springbootwebfluxjjwt.security.model.Role;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author ard333
 */
@Component
public class AuthenticationManager implements ReactiveAuthenticationManager {
	
	@Autowired
	private JWTUtil jwtUtil;
	
	@Override
	@SuppressWarnings("unchecked")
	public Mono<Authentication> authenticate(Authentication authentication) {
		String authToken = authentication.getCredentials().toString();
		
		String email;
		try {
			email = jwtUtil.getUsernameFromToken(authToken);
		} catch (Exception e) {
			email = null;
		}
		if (email != null && jwtUtil.validateToken(authToken)) {
			Claims claims = jwtUtil.getAllClaimsFromToken(authToken);
			List rolesMap = claims.get("role", List.class);
			Long userId = claims.get("id", Long.class);
			List<Role> roles = new ArrayList<>();
			Map<String,String> role = (Map<String, String>) rolesMap.get(0);
			roles.add(Role.valueOf(role.get("authority")));
			HashMap<String, Object> userPrincipal = new HashMap<>();
			userPrincipal.put("email", email);
			userPrincipal.put("userId", userId);
			UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
					userPrincipal,
					null,
					roles.stream().map(authority -> new SimpleGrantedAuthority(authority.name())).collect(Collectors.toList())
			);
			return Mono.just(auth);
		} else {
			return Mono.empty();
		}
	}
}
