import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { createAttendanceViewModel } from "../../viewmodel/attendance/AttendanceViewModel";
import { container } from "../../../core/di/Container";
import { Employee } from "../../../domain/entity/Employee";

interface Props {
  route: {
    params: {
      employee: Employee;
    };
  };
}

export default function AttendanceScreen({ route }: Props) {
  const attendanceViewModel = createAttendanceViewModel(
    container.getCheckInUseCase(),
    container.getCheckOutUseCase(),
    container.getWorkedHoursUseCase()
  );
  const useAttendanceViewModel = attendanceViewModel.createHook();

  const { employee } = route.params;
  const {
    currentAttendance,
    error,
    checkIn,
    checkOut,
    getTotalWorkDone,
    workedHours,
  } = useAttendanceViewModel();

  const [seconds, setSeconds] = useState(0);
  const [workedHoursInSeconds, setWorkedHoursInSeconds] = useState(0);

  useEffect(() => {
    if (workedHours) {
      const [h, m, s] = workedHours.split(":").map(Number);
      setWorkedHoursInSeconds(h * 3600 + m * 60 + s);
      setSeconds(0);
    }
  }, [workedHours]);

  const totalWorkedSeconds = workedHoursInSeconds + seconds;


  useEffect(() => {
    getTotalWorkDone(employee.id);
  }, [employee.id]);

  useEffect(() => {
    if (!currentAttendance?.checkIn || currentAttendance.checkOut) return;

    const timer = setInterval(() => {
      const endTime = new Date(); 
      const diff = Math.floor(
        (endTime.getTime() - currentAttendance.checkIn.getTime()) / 1000
      );
      setSeconds(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentAttendance]);

  const handleCheckIn = async () => {
    if (currentAttendance && !currentAttendance.checkOut) {
      Alert.alert("Already checked in");
      return;
    }
    try {
      await checkIn(employee.id);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleCheckOut = async () => {
    if (!currentAttendance || currentAttendance.checkOut) {
      Alert.alert("No active check-in to check out");
      return;
    }
    try {
      await checkOut();
      await getTotalWorkDone(employee.id);
      setSeconds(0)
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance</Text>

      {employee ? (
        <>
          <View style={styles.employeeItem}>
            <Text style={styles.employeeName}>{employee.name}</Text>
            <Text style={styles.employeePosition}>{employee.position}</Text>
            <Text style={styles.employeeEmail}>{employee.email}</Text>
            <Text style={{ fontSize: 14, marginTop: 4 }}>
              Total Work Done: {formatTime(totalWorkedSeconds)}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.checkButton}>
              <Button title="Check In" onPress={handleCheckIn} />
            </View>
            <View style={styles.checkButton}>
              <Button title="Check Out" onPress={handleCheckOut} />
            </View>
          </View>

          {currentAttendance &&
            currentAttendance.checkIn &&
            !currentAttendance.checkOut && (
              <Text style={styles.workedHours}>
                Current Ongoing Work: {formatTime(seconds)}
              </Text>
            )}

          {error && <Text style={styles.error}>Error: {error}</Text>}
        </>
      ) : (
        <Text>No employee data</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  employeeItem: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  employeeName: { fontSize: 20, fontWeight: "600", color: "#111827" },
  employeePosition: { fontSize: 16, color: "#6b7280", marginTop: 4 },
  employeeEmail: { fontSize: 14, color: "#374151", marginTop: 2 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  checkButton: { flex: 1, marginHorizontal: 5 },
  workedHours: { fontSize: 18, marginTop: 20, textAlign: "center" },
  error: { color: "red", marginTop: 10, textAlign: "center" },
});
