import { customersRepository } from "../repository/customers.repository";
import type { CustomerFilters } from "../types/customers.types";
import type { WalkInCustomerInput } from "../schemas/walkin-customer.schema";

export const customersService = {
  getCustomers(filters: CustomerFilters) {
    return customersRepository.getCustomers(filters);
  },

  getSingleCustomer(id: string) {
    return customersRepository.getSingleCustomer(id);
  },

  createWalkInCustomer(data: WalkInCustomerInput & { created_by: string }) {
    return customersRepository.createWalkInCustomer(data);
  },

  flagCustomer(id: string, flagged: boolean) {
    return customersRepository.flagCustomer(id, flagged);
  },
};
