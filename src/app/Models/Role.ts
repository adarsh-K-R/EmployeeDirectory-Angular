import { Department } from "./Department";

export interface Role {
    id? : string;
    name : string;
    description : string;
    location : string;
    department : Department;
}