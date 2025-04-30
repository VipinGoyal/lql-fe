export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "PATIENT" | "PROVIDER" | "ADMIN" | "COORDINATOR";
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}
