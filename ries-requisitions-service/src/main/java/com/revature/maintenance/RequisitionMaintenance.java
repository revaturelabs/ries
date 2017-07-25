package com.revature.maintenance;


import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.Calendar;
import java.util.Timer;
import java.util.concurrent.TimeUnit;

/**
 * Created by David Griffith on 7/24/2017.
 */
@WebListener
public class RequisitionMaintenance implements ServletContextListener {

    public RequisitionMaintenance() {
        super();
    }

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        Timer t = new Timer();
        Calendar c = Calendar.getInstance();

        //Set the time to midnight
        c.set(Calendar.HOUR, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);

        t.schedule(new RequisitionResolver(), c.getTime(), TimeUnit.MILLISECONDS.convert(1, TimeUnit.DAYS));
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {

    }
}
