package com.revature.dao;

import com.revature.model.Guest;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestDao extends CrudRepository<Guest, Integer> {
}
