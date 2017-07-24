package com.revature.maintenance;

import com.revature.domain.Requisition;
import com.revature.domain.ResolvedRequisition;
import com.revature.service.RequisitionService;
import com.revature.service.ResolvedRequisitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.List;
import java.util.TimerTask;

/**
 * Created by David Griffith on 7/24/2017.
 *
 * Class that implements the functionality of the requisition schedule. The run method
 * should be run on a daily basis, 12am every morning, and moves every requisition with
 * an interview date over 24 hours before the check to the resolved requisition table.
 */
@RestController
public class RequisitionResolver extends TimerTask {
    @Autowired
    RequisitionService service;

    @Autowired
    ResolvedRequisitionService resolvedRequisitionService;

    public void run(){
        //Number of milliseconds in a day
        long milli = 1000 * 60 * 60 * 24;

        //Create a date for yesterday
        Date d = new Date(System.currentTimeMillis() - milli);

        //Get the outdated requisitions
        List<Requisition> list = service.getAllOutdated(d);

        ResolvedRequisition rr;
        for (Requisition r : list){

            //Remove the requisition from the requisition table
            service.delete(r);

            rr = new ResolvedRequisition(r);
            rr.setVideo("Requisition Expired");

            resolvedRequisitionService.save(rr);
        }
    }
}
