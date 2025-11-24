import { Employee, CreateEmployeeData } from "../../domain/entity/Employee";
import { IEmployeeRepository } from "../../domain/repository/IEmployeeRepository";
import { LocalStorage } from "../local/LocalStorage";
import { STORAGE_KEYS } from "../../core/constants/StorageKeys";

export class EmployeeRepositoryImpl implements IEmployeeRepository {
  private storage: LocalStorage;

  constructor() {
    this.storage = LocalStorage.getInstance();
  }

  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    const employees = await this.getEmployees();

    const newEmployee: Employee = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    employees.push(newEmployee);
    await this.storage.setItem(STORAGE_KEYS.EMPLOYEES, employees);

    return newEmployee;
  }

  async getEmployees(): Promise<Employee[]> {
    const employees = await this.storage.getItem<Employee[]>(
      STORAGE_KEYS.EMPLOYEES
    );
    return employees || [];
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    const employees = await this.getEmployees();
    return employees.find((emp) => emp.id === id) || null;
  }

  async updateEmployee(
    id: string,
    data: Partial<CreateEmployeeData>
  ): Promise<Employee> {
    const employees = await this.getEmployees();
    const index = employees.findIndex((emp) => emp.id === id);

    if (index === -1) {
      throw new Error("Employee not found");
    }

    const updatedEmployee = { ...employees[index], ...data };
    employees[index] = updatedEmployee;

    await this.storage.setItem(STORAGE_KEYS.EMPLOYEES, employees);
    return updatedEmployee;
  }

  async deleteEmployee(id: string): Promise<void> {
    const employees = await this.getEmployees();
    const filteredEmployees = employees.filter((emp) => emp.id !== id);

    await this.storage.setItem(STORAGE_KEYS.EMPLOYEES, filteredEmployees);
  }
}
