package com.ard333.springbootwebfluxjjwt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.Past;
import java.util.Date;

@NoArgsConstructor
@Setter
@Getter
@ToString(exclude = "appUser")
@Entity
public class AppUserDetail {
	
	public AppUserDetail(String firstName, String lastName, String imageUrl, Boolean emailVerified) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.imageUrl = imageUrl;
		this.emailVerified = emailVerified;
	}
	
	@Id
	private Long id;
	
	@OneToOne(fetch = FetchType.LAZY,optional = false)
	@MapsId
	@JsonIgnore
	private AppUser appUser;
	
//	@NotEmpty
	private String firstName;
//	@NotEmpty
	private String lastName;
	
//	@NotNull
	@Past
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date date;
	
	
	private Date lastUpdate;
	private Date createdAt;
	
	private String imageUrl;
	
	private Boolean emailVerified = false;
	
	@CreationTimestamp
	private Date created;
	
	@UpdateTimestamp
	private Date modified;
	
	@JsonProperty("app_user_id")
	public Long getUserId() {
		return this.appUser.getId();
	}
	
}
