import { Attendance } from "../entity/Attendance";

export interface IAttendanceRepository {
  checkIn(employeeId: string): Promise<Attendance>;
  checkOut(attendanceId: string): Promise<Attendance>;

  getAttendanceByEmployee(employeeId: string): Promise<Attendance[]>;

  getTotalWorkedHours(employeeId: string): Promise<string>;
}
