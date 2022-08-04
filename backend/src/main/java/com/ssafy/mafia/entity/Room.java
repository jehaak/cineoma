package com.ssafy.mafia.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Room {
	@Id @GeneratedValue
	private int no;
	private int size;
	private String roomTitle;
	private String hostId;
//	@ManyToOne
//	@JoinColumn(name = "host_id")
//	private User user;
	private String password;
	private boolean ifPassword;
	private int memberCnt;
}
