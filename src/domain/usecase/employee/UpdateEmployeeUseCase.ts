import { CreateEmployeeData, Employee, UpdateEmployeeData } from "../../entity/Employee";
import { IEmployeeRepository } from "../../repository/IEmployeeRepository";

export class UpdateEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute(data: UpdateEmployeeData): Promise<Employee> {
    if (!data.name || !data.email || !data.password) {
      throw new Error("Name, email, and password are required");
    }
    return this.employeeRepository.updateEmployee(data.id, data);
  }
}
