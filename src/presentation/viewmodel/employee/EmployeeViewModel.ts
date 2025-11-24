import { useState } from "react";
import { Employee, CreateEmployeeData, UpdateEmployeeData } from "../../../domain/entity/Employee";
import { CreateEmployeeUseCase } from "../../../domain/usecase/employee/CreateEmployeeUseCase";
import { GetEmployeesUseCase } from "../../../domain/usecase/employee/GetEmployeesUseCase";
import { DeleteEmployeeUseCase } from "../../../domain/usecase/employee/DeleteEmployeeUseCase";
import { GetWorkedHoursUseCase } from "../../../domain/usecase/attendance/GetWorkedHoursUseCase";
import { UpdateEmployeeUseCase } from "../../../domain/usecase/employee/UpdateEmployeeUseCase";

export class EmployeeViewModel {
  constructor(
    private createEmployeeUseCase: CreateEmployeeUseCase,
    private getEmployeesUseCase: GetEmployeesUseCase,
    private deleteEmployeeUseCase: DeleteEmployeeUseCase,
    private getWorkedHoursUseCase: GetWorkedHoursUseCase,
    private updateEmployeeUseCase: UpdateEmployeeUseCase
  ) {}

  createHook() {
    return () => {
      const [employees, setEmployees] = useState<Employee[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [workedHours, setWorkedHours] = useState<{ [id: string]: number }>(
        {}
      );

      const createEmployee = async (data: CreateEmployeeData) => {
        setLoading(true);
        setError(null);

        try {
          const newEmployee = await this.createEmployeeUseCase.execute(data);
          setEmployees((prev) => [...prev, newEmployee]);
          return newEmployee;
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to create employee"
          );
          throw err;
        } finally {
          setLoading(false);
        }
      };
      const updateEmployee = async (data: UpdateEmployeeData) => {
        setLoading(true);
        setError(null);

        try {
          const updated = await this.updateEmployeeUseCase.execute(data);

          setEmployees((prev) =>
            prev.map((emp) => (emp.id === updated.id ? updated : emp))
          );

          return updated;
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to update employee"
          );
          throw err;
        } finally {
          setLoading(false);
        }
      };

      const loadEmployees = async () => {
        setLoading(true);
        try {
          const list = await this.getEmployeesUseCase.execute();
          setEmployees(list);

          const hoursMap: any = {};
          for (const emp of list) {
            const hours = await this.getWorkedHoursUseCase.execute(emp.id);
            hoursMap[emp.id] = hours;
          }
          setWorkedHours(hoursMap);
        } catch (e) {
          setError("Failed to load employees");
        }
        setLoading(false);
      };

      const deleteEmployee = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
          await this.deleteEmployeeUseCase.execute(id);
          setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to delete employee"
          );
          throw err;
        } finally {
          setLoading(false);
        }
      };

      return {
        employees,
        loading,
        error,
        workedHours,
        createEmployee,
        loadEmployees,
        deleteEmployee,
        updateEmployee,
      };
    };
  }
}

// Factory function
export const createEmployeeViewModel = (
  createEmployeeUseCase: CreateEmployeeUseCase,
  getEmployeesUseCase: GetEmployeesUseCase,
  deleteEmployeeUseCase: DeleteEmployeeUseCase,
  getWorkedHoursUseCase: GetWorkedHoursUseCase,
  updateEmployeeUseCase: UpdateEmployeeUseCase
) => {
  return new EmployeeViewModel(
    createEmployeeUseCase,
    getEmployeesUseCase,
    deleteEmployeeUseCase,
    getWorkedHoursUseCase,
    updateEmployeeUseCase
  );
};
