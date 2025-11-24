import "react-native-gesture-handler"; // must be first
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/presentation/view/login/LoginScreen";
import EmployeeListScreen from "./src/presentation/view/employee/EmployeeListScreen";
import EmployeeFormScreen from "./src/presentation/view/employee/EmployeeFormScreen";
import AttendanceScreen from "./src/presentation/view/attendance/AttendanceScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="EmployeeList" component={EmployeeListScreen} />
        <Stack.Screen name="EmployeeForm" component={EmployeeFormScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
