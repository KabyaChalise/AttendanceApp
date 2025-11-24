import { CreateEmployeeData, Employee } from "../../entity/Employee";
import { IEmployeeRepository } from "../../repository/IEmployeeRepository";

export class CreateEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute(data: CreateEmployeeData): Promise<Employee> {
    if (!data.name || !data.email || !data.password) {
      throw new Error("Name, email, and password are required");
    }
    return this.employeeRepository.createEmployee(data);
  }
}


