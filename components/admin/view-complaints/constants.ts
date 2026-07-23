export type TechnicianOption = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
};

export const TECHNICIANS = [
  { name: "Rajesh Sharma", phone: "+91 98450 12345", dept: "Plumbing" },
  { name: "Mohit Kumar", phone: "+91 98450 54321", dept: "Electrical" },
  { name: "Amit Pal", phone: "+91 98450 88990", dept: "Carpentry" },
  { name: "Vijay Pratap", phone: "+91 98450 22110", dept: "HVAC" },
];
