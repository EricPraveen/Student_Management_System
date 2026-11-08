export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: 'Male' | 'Female' | 'Other' | string | null;
  address?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
}

export interface UpdateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
}

export interface StudentStatistics {
  total: number;
  male: number;
  female: number;
  other: number;
  malePercentage: number;
  femalePercentage: number;
  otherPercentage: number;
}
