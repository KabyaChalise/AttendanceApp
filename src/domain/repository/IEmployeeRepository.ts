import { Employee, CreateEmployeeData } from "../entity/Employee";

export interface IEmployeeRepository {
  createEmployee(data: CreateEmployeeData): Promise<Employee>;
  getEmployees(): Promise<Employee[]>;
  // getEmployeeById(id: string): Promise<Employee | null>;
  updateEmployee(
    id: string,
    data: Partial<CreateEmployeeData>
  ): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;
} 
