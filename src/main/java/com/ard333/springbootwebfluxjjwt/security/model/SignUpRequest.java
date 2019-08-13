package com.ard333.springbootwebfluxjjwt.security.model;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.Date;


@Data
public class SignUpRequest {
    
    private String username;

    private String email;

    private String password;
    
    private String firstName;
    private String lastName;
    private Date date;
}
