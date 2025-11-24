import { IEmployeeRepository } from "../../repository/IEmployeeRepository";
import { Employee } from "../../entity/Employee";
import { App_Constants } from "../../../core/constants/AppConstants";

export type LoginResult = { isAdmin: boolean; employee?: Employee;  };

export class LoginUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    if (
      email === App_Constants.ADMIN_EMAIL &&
      password === App_Constants.ADMIN_PASSWORD
    ) {
      return { isAdmin: true };
    }

    const employees = await this.employeeRepository.getEmployees();
    const employee = employees.find(
      (emp) => emp.email === email && emp.password === password
    );

    if (employee) {
      return { isAdmin: false, employee };
    }

    throw new Error("Invalid credentials");
  }
}
