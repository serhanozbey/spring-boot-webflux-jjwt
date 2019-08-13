package com.ard333.springbootwebfluxjjwt.model;

import com.ard333.springbootwebfluxjjwt.security.model.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;

public class UserPrincipal implements OAuth2User, UserDetails {
	private static final long serialVersionUID = 6564905217054043887L;
	
	private Long id;
	private String email;
	private String password;
	private Collection<? extends GrantedAuthority> authorities;
	private Map<String, Object> attributes;
	
	
	
	public UserPrincipal(Long id, String email, String password, Collection<? extends GrantedAuthority> authorities) {
		this.id = id;
		this.email = email;
		this.password = password;
		this.authorities = authorities;
	}
	
	/*normal user*/
	public static UserPrincipal create(AppUser appUser) {
		GrantedAuthority authority = appUser.getRole().equals(Role.ROLE_USER) ? new SimpleGrantedAuthority("ROLE_USER") : new SimpleGrantedAuthority("ROLE_ADMIN");
		List<GrantedAuthority> list = Collections.singletonList(authority);
		
		return new UserPrincipal(
				appUser.getId(),
				appUser.getEmail(),
				appUser.getPassword(),
				list
		);
	}
	
	
	public Long getId() {
		return id;
	}
	
	public String getEmail() {
		return email;
	}
	
	@Override
	public String getPassword() {
		return password;
	}
	
	@Override
	public String getUsername() {
		return email;
	}
	
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	
	@Override
	public boolean isEnabled() {
		return true;
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}
	
	@Override
	public Map<String, Object> getAttributes() {
		return attributes;
	}
	
	public void setAttributes(Map<String, Object> attributes) {
		this.attributes = attributes;
	}
	
	@Override
	public String getName() {
		return String.valueOf(id);
	}
}
