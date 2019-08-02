package com.ard333.springbootwebfluxjjwt.security.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

/**
 *
 * @author ard333
 */
@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class  AuthRequest {
	
	@NotEmpty
	@NotNull
	private String email;
	
	private String password;

}
