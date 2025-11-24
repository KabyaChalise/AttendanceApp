import { useState } from "react";
import { CheckInUseCase } from "../../../domain/usecase/attendance/CheckInUseCase";
import { CheckOutUseCase } from "../../../domain/usecase/attendance/CheckOutUseCase";
import { Attendance } from "../../../domain/entity/Attendance";
import { GetWorkedHoursUseCase } from "../../../domain/usecase/attendance/GetWorkedHoursUseCase";

export class AttendanceViewModel {
  constructor(
    private checkInUseCase: CheckInUseCase,
    private checkOutUseCase: CheckOutUseCase,
    private getWorkedHoursUseCase: GetWorkedHoursUseCase
  ) {}

  createHook() {
    return () => {
      const [currentAttendance, setCurrentAttendance] =
        useState<Attendance | null>(null);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [workedHours, setWorkedHours] = useState<string | null>(null);

      const getTotalWorkDone = async (employeeId: string) => {
        setIsLoading(true);
        setError(null);
        try {
          const hours = await this.getWorkedHoursUseCase.execute(employeeId);
          setWorkedHours(hours);
        } catch (error) {
          setError("Failed to load work done ");
        }
      };

      const checkIn = async (employeeId: string) => {
        setIsLoading(true);
        setError(null);
        try {
          const attendance = await this.checkInUseCase.execute(employeeId);
          setCurrentAttendance(attendance);
          return attendance;
        } catch (err: any) {
          setError(err.message);
          throw err;
        } finally {
          setIsLoading(false);
        }
      };

      const checkOut = async () => {
        if (!currentAttendance) {
          const errorMsg = "No active attendance to check out";
          setError(errorMsg);
          throw new Error(errorMsg);
        }
        setIsLoading(true);
        setError(null);
        try {
          const attendance = await this.checkOutUseCase.execute(
            currentAttendance.id
          );
          setCurrentAttendance(attendance);
          return attendance;
        } catch (err: any) {
          setError(err.message);
          throw err;
        } finally {
          setIsLoading(false);
        }
      };

      return {
        currentAttendance,
        isLoading,
        error,
        checkIn,
        checkOut,
        getTotalWorkDone,
        workedHours,
      };
    };
  }
}

export const createAttendanceViewModel = (
  checkInUseCase: CheckInUseCase,
  checkOutUseCase: CheckOutUseCase,
  getWorkedHoursUseCase: GetWorkedHoursUseCase
) => {
  return new AttendanceViewModel(
    checkInUseCase,
    checkOutUseCase,
    getWorkedHoursUseCase
  );
};
