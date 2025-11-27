import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createLoginViewModel } from "../../viewmodel/login/LoginViewModel";
import { container } from "../../../core/di/Container";

export default function LoginScreen() {
  const loginViewModel = createLoginViewModel(container.getLoginUseCase());
  const useLoginViewModel = loginViewModel.createHook();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation: any = useNavigation();

  const { login, loading, error } = useLoginViewModel();

  useEffect(() => {
    if (error) {
      Alert.alert("Login Error", error);
    }
  }, [error]);

  const handleLogin = async () => {
    if (loading) {
      Alert.alert("Please wait", "Logging in...");
      return;
    }

    const result = await login(email, password);

    if (!result) return;

    if (result.isAdmin) {
      navigation.navigate("EmployeeList");
    } else if (result.employee) {
      navigation.navigate("Attendance", { employee: result.employee });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.btn}>
        <Button title="Login" onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: "#f3f4f6",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 32 },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  btn: { width: "100%" },
});
