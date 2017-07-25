package com.revature.util;


import com.revature.domain.Employee;
import com.revature.domain.Role;


/**
 * Created by tyler on 7/19/2017.
 */
public class UserAuth {

    public static boolean isTrainer(Employee employee) {
        Role employeeRole = employee.getRole();
        if (employeeRole.isTrainer()) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean isRecruiter(Employee employee) {
        Role employeeRole = employee.getRole();
        if (employeeRole.isTrainer()) {
            return true;
        } else {
            return false;
        }
    }
}
