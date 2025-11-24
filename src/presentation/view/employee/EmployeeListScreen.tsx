import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { createEmployeeViewModel } from "../../viewmodel/employee/EmployeeViewModel";
import { container } from "../../../core/di/Container";

export default function EmployeeListScreen({ navigation }: any) {
  const employeeViewModel = createEmployeeViewModel(
    container.getCreateEmployeeUseCase(),
    container.getGetEmployeesUseCase(),
    container.getDeleteEmployeeUseCase(),
    container.getWorkedHoursUseCase(),
    container.getUpdateEmployeeUseCase(),
  );
  const useEmployeeViewModel = employeeViewModel.createHook();

  const {
    employees,
    loading,
    error,
    workedHours,
    loadEmployees,
    deleteEmployee,
  } = useEmployeeViewModel();

  useFocusEffect(
    React.useCallback(() => {
      loadEmployees();
    }, [])
  );

  useEffect(() => {
    if (error) Alert.alert("Error", error);
  }, [error]);

  const handleDelete = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteEmployee(id);
            Alert.alert("Deleted", "Employee deleted successfully");
            await loadEmployees();
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to delete employee");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading employees...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Management</Text>
      <Button
        title="Add New Employee"
        onPress={() => navigation.navigate("EmployeeForm")}
      />
      <Text style={styles.sectionTitle}>
        Employee List ({employees.length})
      </Text>

      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.employeeItem}>
            <View style={styles.employeeRow}>
              <Text style={styles.employeeName}>{item.name}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() =>
                    navigation.navigate("EmployeeForm", { employee: item })
                  }
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.employeePosition}>{item.position}</Text>
            <Text style={styles.employeeEmail}>{item.email}</Text>
            <Text style={{ fontSize: 14, marginTop: 4 }}>
              Total Work Done: {workedHours[item.id] || "00:00:00"}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No employees found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f3f4f6" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 16 },
  employeeItem: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  employeeName: { fontSize: 18, fontWeight: "bold" },
  employeePosition: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  employeeEmail: { fontSize: 14, color: "#374151", marginTop: 2 },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 20,
    fontSize: 16,
  },
  employeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  buttonRow: {
    flexDirection: "row",
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginLeft: 8,
  },

  editButton: {
    backgroundColor: "green",
  },

  deleteButton: {
    backgroundColor: "red",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
