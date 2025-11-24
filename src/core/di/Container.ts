import { AttendanceRepositoryImpl } from "../../data/repository/AttendanceRepositoryImpl";
import { EmployeeRepositoryImpl } from "../../data/repository/EmployeeRepositoryImpl";
import { IAttendanceRepository } from "../../domain/repository/IAttendanceRepository";
import { IEmployeeRepository } from "../../domain/repository/IEmployeeRepository";
import { CheckInUseCase } from "../../domain/usecase/attendance/CheckInUseCase";
import { CheckOutUseCase } from "../../domain/usecase/attendance/CheckOutUseCase";
import { GetWorkedHoursUseCase } from "../../domain/usecase/attendance/GetWorkedHoursUseCase";
import { CreateEmployeeUseCase } from "../../domain/usecase/employee/CreateEmployeeUseCase";
import { DeleteEmployeeUseCase } from "../../domain/usecase/employee/DeleteEmployeeUseCase";
import { GetEmployeesUseCase } from "../../domain/usecase/employee/GetEmployeesUseCase";
import { UpdateEmployeeUseCase } from "../../domain/usecase/employee/UpdateEmployeeUseCase";
import { LoginUseCase } from "../../domain/usecase/login/LoginUseCase";

class Container {
  private static instance: Container;

  // Memoized repositories as singletons
  private employeeRepo: IEmployeeRepository | null = null;
  private attendanceRepo: IAttendanceRepository | null = null;

  // Memoized use cases
  private createEmployeeUseCase: CreateEmployeeUseCase | null = null;
  private updateEmployeeUseCase: UpdateEmployeeUseCase | null = null;
  private getEmployeesUseCase: GetEmployeesUseCase | null = null;
  private deleteEmployeeUseCase: DeleteEmployeeUseCase | null = null;
  private loginUseCase: LoginUseCase | null = null;
  private checkInUseCase: CheckInUseCase | null = null;
  private checkOutUseCase: CheckOutUseCase | null = null;
  private workedHoursUseCase: GetWorkedHoursUseCase | null = null;

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  getEmployeeRepository(): IEmployeeRepository {
    if (!this.employeeRepo) {
      this.employeeRepo = new EmployeeRepositoryImpl();
    }
    return this.employeeRepo;
  }

  getAttendanceRepository(): IAttendanceRepository {
    if (!this.attendanceRepo) {
      this.attendanceRepo = new AttendanceRepositoryImpl();
    }
    return this.attendanceRepo;
  }

  getCreateEmployeeUseCase(): CreateEmployeeUseCase {
    if (!this.createEmployeeUseCase) {
      this.createEmployeeUseCase = new CreateEmployeeUseCase(
        this.getEmployeeRepository()
      );
    }
    return this.createEmployeeUseCase;
  }

  getUpdateEmployeeUseCase(): UpdateEmployeeUseCase {
    if (!this.updateEmployeeUseCase) {
      this.updateEmployeeUseCase = new UpdateEmployeeUseCase(
        this.getEmployeeRepository()
      );
    }
    return this.updateEmployeeUseCase;
  }

  getGetEmployeesUseCase(): GetEmployeesUseCase {
    if (!this.getEmployeesUseCase) {
      this.getEmployeesUseCase = new GetEmployeesUseCase(
        this.getEmployeeRepository()
      );
    }
    return this.getEmployeesUseCase;
  }

  getDeleteEmployeeUseCase(): DeleteEmployeeUseCase {
    if (!this.deleteEmployeeUseCase) {
      this.deleteEmployeeUseCase = new DeleteEmployeeUseCase(
        this.getEmployeeRepository()
      );
    }
    return this.deleteEmployeeUseCase;
  }

  getLoginUseCase(): LoginUseCase {
    if (!this.loginUseCase) {
      this.loginUseCase = new LoginUseCase(this.getEmployeeRepository());
    }
    return this.loginUseCase;
  }

  getCheckInUseCase(): CheckInUseCase {
    if (!this.checkInUseCase) {
      this.checkInUseCase = new CheckInUseCase(this.getAttendanceRepository());
    }
    return this.checkInUseCase;
  }

  getCheckOutUseCase(): CheckOutUseCase {
    if (!this.checkOutUseCase) {
      this.checkOutUseCase = new CheckOutUseCase(
        this.getAttendanceRepository()
      );
    }
    return this.checkOutUseCase;
  }

  getWorkedHoursUseCase(): GetWorkedHoursUseCase {
    if (!this.workedHoursUseCase) {
      this.workedHoursUseCase = new GetWorkedHoursUseCase(
        this.getAttendanceRepository()
      );
    }
    return this.workedHoursUseCase;
  }
}

export const container = Container.getInstance();
