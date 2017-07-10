Create Table Requisition (
  req_ID Number(10) Primary Key,
  req_Create_Date Timestamp NOT NULL,
  req_Interview_Date Timestamp,
  req_host Number(10) NOT NULL,
  req_guest Number(10) NOT NULL,
  req_recruiter NUMBER(10) NOT NULL,
  req_host_url Varchar2(2084) NOT NULL UNIQUE,
  req_guest_url Varchar2(2084) NOT NULL UNIQUE,
  req_observer_url VARCHAR2(2084) NOT NULL UNIQUE
);
Create Sequence req_sequence
Start with 1
Increment By 1;

Create Table Resolved_Requisition(
  res_req_id Number(10) Primary Key,
  res_req_video VARCHAR2(2084),
  res_req_create_date Timestamp NOT NULL,
  res_req_interview_date Timestamp,
  res_req_guest_id Number(10) NOT NULL,
  res_req_host_id Number(10) NOT NULL,
  res_req_recruiter_id NUMBER(10) NOT NULL
);
Create Sequence res_req_sequence
Start with 1
Increment By 1;