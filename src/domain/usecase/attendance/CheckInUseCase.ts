import { Attendance } from "../../entity/Attendance";
import { IAttendanceRepository } from "../../repository/IAttendanceRepository";

export class CheckInUseCase {
  constructor(private attendanceRepository: IAttendanceRepository) {}

  async execute(employeeId: string): Promise<Attendance> {
    if (!employeeId) {
      throw new Error("Invalid employee ID");
    }
    return this.attendanceRepository.checkIn(employeeId);
  }
}
