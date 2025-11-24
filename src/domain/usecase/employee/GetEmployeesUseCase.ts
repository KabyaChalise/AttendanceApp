import { Employee } from "../../entity/Employee";
import { IEmployeeRepository } from "../../repository/IEmployeeRepository";

export class GetEmployeesUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute(): Promise<Employee[]> {
    return this.employeeRepository.getEmployees();
  }
}
