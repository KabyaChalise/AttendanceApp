export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface CreateEmployeeData {
  name: string;
  position: string;
  email: string;
  password: string;
}

export interface UpdateEmployeeData {
  id: string;
  name?: string;
  position?: string;
  email?: string;
  password?: string;
}
