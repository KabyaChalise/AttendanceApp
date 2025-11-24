import { useState } from "react";
import {
  LoginUseCase,
  LoginResult,
} from "../../../domain/usecase/login/LoginUseCase";

export class LoginViewModel {
  constructor(private loginUseCase: LoginUseCase) {}

  createHook() {
    return () => {
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      const login = async (
        email: string,
        password: string
      ): Promise<LoginResult | null> => {
        setLoading(true);
        setError(null);

        try {
          const result = await this.loginUseCase.execute(email, password);
          return result;
        } catch (err: any) {
          setError(err.message || "Login failed");
          return null;
        } finally {
          setLoading(false);
        }
      };

      return { login, loading, error };
    };
  }
}

export const createLoginViewModel = (loginUseCase: LoginUseCase) => {
  return new LoginViewModel(loginUseCase);
};
