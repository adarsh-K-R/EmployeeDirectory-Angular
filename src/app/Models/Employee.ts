import { Department } from "./Department";
import { Project } from "./Project";
import { Role } from "./Role";

export interface Employee {
    empNo : string;
    profilePicture : string;
    firstName : string;
    lastName : string;
    emailId : string;
    mobileNo : string;
    dateOfBirth : string;
    joinDate : string;
    location : string;
    department : Department;
    role : Role;
    status : string;
    manager : string;
    project : Project;
}