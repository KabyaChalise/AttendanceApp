import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { createEmployeeViewModel } from "../../viewmodel/employee/EmployeeViewModel";
import { container } from "../../../core/di/Container";
import { UpdateEmployeeUseCase } from "../../../domain/usecase/employee/UpdateEmployeeUseCase";

export default function EmployeeFormScreen({ navigation, route }: any) {
  const employeeViewModel = createEmployeeViewModel(
    container.getCreateEmployeeUseCase(),
    container.getGetEmployeesUseCase(),
    container.getDeleteEmployeeUseCase(),
    container.getWorkedHoursUseCase(),
    container.getUpdateEmployeeUseCase()
  );
  const { employee } = route.params;

  const useEmployeeViewModel = employeeViewModel.createHook();

  const { loading, error, createEmployee, updateEmployee } =
    useEmployeeViewModel();

  const [formData, setFormData] = useState({
    name: employee.name || "",
    position: employee.position || "",
    email: employee.email || "",
    password: employee.password || "",
  });

  // Handle errors
  useEffect(() => {
    if (error) Alert.alert("Error", error);
  }, [error]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert("Validation Error", "Name, email, and password are required");
      return;
    }

    try {
      if (employee) {
        await updateEmployee({ id: employee.id, ...formData });
        Alert.alert("Success", "Employee updated", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await createEmployee(formData);
        Alert.alert("Success", "Employee created successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save employee");
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {employee ? "Edit Employee" : "New Employee"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        value={formData.name}
        onChangeText={(val) => handleInputChange("name", val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Position *"
        value={formData.position}
        onChangeText={(val) => handleInputChange("position", val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email *"
        value={formData.email}
        onChangeText={(val) => handleInputChange("email", val)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password *"
        value={formData.password}
        onChangeText={(val) => handleInputChange("password", val)}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            title={employee ? "Update Employee " : "Create Employee"}
            onPress={handleSubmit}
          />
          <View style={styles.spacer} />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            color="#6b7280"
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f3f4f6" },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 20 },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: { marginVertical: 20 },
  spacer: { height: 10 },
  loader: { marginVertical: 20 },
});
