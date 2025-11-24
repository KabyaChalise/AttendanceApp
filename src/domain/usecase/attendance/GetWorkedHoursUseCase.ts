import { IAttendanceRepository } from "../../repository/IAttendanceRepository";

export class GetWorkedHoursUseCase {
  constructor(private attendanceRepository: IAttendanceRepository) {}

  async execute(employeeId: string): Promise<string> {
    return this.attendanceRepository.getTotalWorkedHours(employeeId);
  }
}
