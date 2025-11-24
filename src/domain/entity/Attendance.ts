export interface Attendance {
  id: string;
  employeeId: string;
  checkIn: Date | null;
  checkOut: Date | null;
  createdAt: Date;
}
