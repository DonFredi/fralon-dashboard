import { staffRepository } from "../repository/staff.repository";
import type { StaffFilters } from "../types/staff.types";

export const staffService = {
  getStaff(filters: StaffFilters) {
    return staffRepository.getStaff(filters);
  },

  getSingleStaff(id: string) {
    return staffRepository.getSingleStaff(id);
  },

  findCustomerByEmail(email: string) {
    return staffRepository.findCustomerByEmail(email);
  },

  promoteToStaff(targetUserId: string) {
    return staffRepository.promoteToStaff(targetUserId);
  },

  demoteToCustomer(targetUserId: string) {
    return staffRepository.demoteToCustomer(targetUserId);
  },

  setStaffActive(targetUserId: string, active: boolean) {
    return staffRepository.setStaffActive(targetUserId, active);
  },
};
