package com.ard333.springbootwebfluxjjwt.model;


import com.ard333.springbootwebfluxjjwt.security.model.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class AppUser {
	
	public AppUser(String username, @Email @NotEmpty String email, AppUserDetail appUserDetail, Role role, AuthProvider authProvider) {
		this.username = username;
		this.email = email;
		this.appUserDetail = appUserDetail;
		this.role = role;
		this.authProvider = authProvider;
	}
	
	//mandatory fields, also in constructor
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
//	@Size(min = 5, max = 10)
//	@NotEmpty
	@Column(unique = true)
	private String username;
	@Email	@NotEmpty
	@Column(unique = true)
	private String email;
	@OneToOne(mappedBy = "appUser", cascade = CascadeType.ALL,fetch = FetchType.LAZY, orphanRemoval = true, optional = false)
	private AppUserDetail appUserDetail;
	
	//optional fields
	//FIXME: This should be worked as OAuth2 users are still creating PasswordConstrationValidator exceptions.
	//@ValidPassword
	@JsonIgnore
	private String password;
	private AuthProvider authProvider;
	private String providerId;
	private Role role;
	
	
	@PrePersist
	private void prePersist() {
		this.appUserDetail.setAppUser(this);
	}
}
