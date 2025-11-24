import { STORAGE_KEYS } from "../../core/constants/StorageKeys";
import { Attendance } from "../../domain/entity/Attendance";
import { IAttendanceRepository } from "../../domain/repository/IAttendanceRepository";
import { LocalStorage } from "../local/LocalStorage";

export class AttendanceRepositoryImpl implements IAttendanceRepository {
  private storage: LocalStorage;

  constructor() {
    this.storage = LocalStorage.getInstance();
  }

  async getAttendanceByEmployee(employeeId: string): Promise<Attendance[]> {
    const all = await this.getAllAttendances();
    return all.filter((a) => a.employeeId === employeeId);
  }

  async getTotalWorkedHours(employeeId: string): Promise<string> {
    const attendances = await this.getAttendanceByEmployee(employeeId);

    let totalSeconds = 0;

    attendances.forEach((a) => {
      if (a.checkIn && a.checkOut) {
        const diff = (a.checkOut.getTime() - a.checkIn.getTime()) / 1000;
        totalSeconds += diff;
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  async checkIn(employeeId: string): Promise<Attendance> {
    const attendances = await this.getAllAttendances();

    const newAttendance: Attendance = {
      id: Date.now().toString(),
      employeeId,
      checkIn: new Date(),
      checkOut: null,
      createdAt: new Date(),
    };

    console.log(
      `[CheckIn] Employee ID: ${employeeId}, Time: ${newAttendance.checkIn.toISOString()}`
    );

    attendances.push(newAttendance);
    await this.storage.setItem(STORAGE_KEYS.ATTENDANCES, attendances);

    console.log("[CheckIn] Attendance saved successfully", newAttendance);

    return newAttendance;
  }

  async checkOut(attendanceId: string): Promise<Attendance> {
    const attendances = await this.getAllAttendances();
    const index = attendances.findIndex((a) => a.id === attendanceId);

    if (index === -1) {
      console.log(`[CheckOut] Attendance ID not found: ${attendanceId}`);
      throw new Error("Attendance not found");
    }

    attendances[index].checkOut = new Date();

    console.log(
      `[CheckOut] Attendance ID: ${attendanceId}, CheckOut Time: ${attendances[
        index
      ].checkOut.toISOString()}`
    );

    await this.storage.setItem(STORAGE_KEYS.ATTENDANCES, attendances);

    console.log(
      "[CheckOut] Attendance updated successfully",
      attendances[index]
    );

    return attendances[index];
  }

  private async getAllAttendances(): Promise<Attendance[]> {
    const attendances = await this.storage.getItem<Attendance[]>(
      STORAGE_KEYS.ATTENDANCES
    );

    if (!attendances) return [];

    return attendances.map((a) => ({
      ...a,
      checkIn: a.checkIn ? new Date(a.checkIn) : null,
      checkOut: a.checkOut ? new Date(a.checkOut) : null,
      createdAt: new Date(a.createdAt),
    }));
  }
}
