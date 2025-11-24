import { IEmployeeRepository } from "../../repository/IEmployeeRepository";

export class DeleteEmployeeUseCase {
    constructor(private employeeRepository: IEmployeeRepository) {}
    async execute(id: string): Promise<void> {
        return this.employeeRepository.deleteEmployee(id);
    }
}