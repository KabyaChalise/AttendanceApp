import { Attendance } from "../../entity/Attendance";
import { IAttendanceRepository } from "../../repository/IAttendanceRepository";

export class CheckOutUseCase {
  constructor(private attendanceRepository: IAttendanceRepository) {}

  async execute(attendanceId: string): Promise<Attendance> {
    if (!attendanceId) {
      throw new Error("Invalid Attendance ID");
    }
    return this.attendanceRepository.checkOut(attendanceId);
  }
}
