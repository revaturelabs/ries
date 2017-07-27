package com.revature.util;

import com.revature.domain.Requisition;
import org.apache.commons.codec.digest.DigestUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Brandon on 7/11/2017.
 */
public class UrlGenerator {

    //Generate Urls for new requisitions
    //Utilizes the guest and recruiter IDs to generate unique hashes for checking purposes
    public static Requisition generateUrls(Requisition r){
        List<String> urls = new ArrayList<String>();
        //INSERT REAL DOMAIN ADDRESS HERE
        //INSERT REAL DOMAIN ADDRESS HERE
        //INSERT REAL DOMAIN ADDRESS HERE
        //INSERT REAL DOMAIN ADDRESS HERE
        //INSERT REAL DOMAIN ADDRESS HERE
        System.out.println("in the stupid url generator");
        System.out.println(r.toString());

        String urlbase = "www.insertrealaddresslater.com/guestsession/?gid="+r.getReqGuest().toString()+"&rid="+r.getReqRecruiter()+"&key=";
        String guesturl = "guest" + r.getReqGuest().toString() + r.getReqRecruiter().toString();
        guesturl = DigestUtils.sha1Hex(guesturl);
        guesturl = urlbase + guesturl;
        r.setGuestUrl(guesturl);
        urlbase = "www.insertrealaddresslater.com/session/?gid="+r.getReqGuest().toString()+"&rid="+r.getReqRecruiter()+"&key=";
        String hosturl = "host" + r.getReqGuest().toString() + r.getReqRecruiter().toString();
        hosturl = DigestUtils.sha1Hex(hosturl);
        hosturl = urlbase + hosturl;
        r.setHostUrl(hosturl);
        String observeurl = "observe" + r.getReqGuest().toString() + r.getReqRecruiter().toString();
        observeurl = DigestUtils.sha1Hex(observeurl);
        observeurl = urlbase + observeurl;
        r.setObserverUrl(observeurl);

        KinesisEmailProducer.writeURLEmails(r);
        return r;
    }
}
