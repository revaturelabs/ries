package com.revature.service;

import com.revature.dao.GuestDao;
import com.revature.model.Guest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GuestService {
    private final GuestDao dao;

    @Autowired
    public GuestService(GuestDao dao) {
        this.dao = dao;
    }

    public List<Guest> getAll() {
        return (List<Guest>) dao.findAll();
    }

    public Guest getById(Integer id) {
        return dao.findOne(id);
    }

    public Guest getByPin(Integer pin) {
        return dao.findByPin(pin);
    }

    public void save(Guest g){
        dao.save(g);
    }

    public void delete(Guest g) {
        dao.delete(g);
    }
}
