package com.revature.service;

import com.revature.dao.GuestDao;
import com.revature.model.Guest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class GuestService {
    private final GuestDao dao;

    @Autowired
    public GuestService(GuestDao dao) {
        this.dao = dao;
    }

    public Guest getById(Integer id) {
        return dao.findOne(id);
    }

    public void save(Guest g){ dao.save(g); }
}
