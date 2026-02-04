export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      AdminUser: {
        Row: {
          createdAt: string
          email: string
          id: string
          name: string | null
          role: string
          status: string | null
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          name?: string | null
          role?: string
          status?: string | null
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          name?: string | null
          role?: string
          status?: string | null
        }
        Relationships: []
      }
      Applicant: {
        Row: {
          address: string
          age: number
          createdAt: string
          dob: string
          email: string | null
          firstName: string
          id: string
          lga: string
          middleName: string | null
          parish: string
          phone: string
          prevScholarship: boolean
          prevScholarshipDate: string | null
          sex: string
          stateOrigin: string
          surname: string
          town: string
          updatedAt: string
        }
        Insert: {
          address: string
          age: number
          createdAt?: string
          dob: string
          email?: string | null
          firstName: string
          id: string
          lga: string
          middleName?: string | null
          parish?: string
          phone: string
          prevScholarship?: boolean
          prevScholarshipDate?: string | null
          sex: string
          stateOrigin: string
          surname: string
          town: string
          updatedAt: string
        }
        Update: {
          address?: string
          age?: number
          createdAt?: string
          dob?: string
          email?: string | null
          firstName?: string
          id?: string
          lga?: string
          middleName?: string | null
          parish?: string
          phone?: string
          prevScholarship?: boolean
          prevScholarshipDate?: string | null
          sex?: string
          stateOrigin?: string
          surname?: string
          town?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Application: {
        Row: {
          admissionLetterUrl: string | null
          applicantId: string
          approvedAmount: string | null
          assistanceLetterUrl: string | null
          birthCertUrl: string | null
          classPosition: string | null
          classSize: number | null
          committeeNotes: string | null
          createdAt: string
          disbursedDate: string | null
          enoughBooks: boolean
          id: string
          lastResult: string | null
          libraryAccess: boolean
          passportUrl: string | null
          paymentReference: string | null
          presentClass: string
          primaryCertUrl: string | null
          repeatedClass: boolean
          schoolAddress: string
          schoolBillUrl: string | null
          schoolFees: string
          schoolName: string
          schoolResultUrl: string | null
          scoreAcademic: number | null
          scoreChurch: number | null
          scoreFinancial: number | null
          sentAway: boolean
          status: string
          textBooksCost: string | null
          updatedAt: string
          voucherCode: string | null
        }
        Insert: {
          admissionLetterUrl?: string | null
          applicantId: string
          approvedAmount?: string | null
          assistanceLetterUrl?: string | null
          birthCertUrl?: string | null
          classPosition?: string | null
          classSize?: number | null
          committeeNotes?: string | null
          createdAt?: string
          disbursedDate?: string | null
          enoughBooks?: boolean
          id: string
          lastResult?: string | null
          libraryAccess?: boolean
          passportUrl?: string | null
          paymentReference?: string | null
          presentClass: string
          primaryCertUrl?: string | null
          repeatedClass?: boolean
          schoolAddress: string
          schoolBillUrl?: string | null
          schoolFees: string
          schoolName: string
          schoolResultUrl?: string | null
          scoreAcademic?: number | null
          scoreChurch?: number | null
          scoreFinancial?: number | null
          sentAway?: boolean
          status?: string
          textBooksCost?: string | null
          updatedAt: string
          voucherCode?: string | null
        }
        Update: {
          admissionLetterUrl?: string | null
          applicantId?: string
          approvedAmount?: string | null
          assistanceLetterUrl?: string | null
          birthCertUrl?: string | null
          classPosition?: string | null
          classSize?: number | null
          committeeNotes?: string | null
          createdAt?: string
          disbursedDate?: string | null
          enoughBooks?: boolean
          id?: string
          lastResult?: string | null
          libraryAccess?: boolean
          passportUrl?: string | null
          paymentReference?: string | null
          presentClass?: string
          primaryCertUrl?: string | null
          repeatedClass?: boolean
          schoolAddress?: string
          schoolBillUrl?: string | null
          schoolFees?: string
          schoolName?: string
          schoolResultUrl?: string | null
          scoreAcademic?: number | null
          scoreChurch?: number | null
          scoreFinancial?: number | null
          sentAway?: boolean
          status?: string
          textBooksCost?: string | null
          updatedAt?: string
          voucherCode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Application_applicantId_fkey"
            columns: ["applicantId"]
            isOneToOne: false
            referencedRelation: "Applicant"
            referencedColumns: ["id"]
          },
        ]
      }
      Assessment: {
        Row: {
          academicScore: number
          adminUserId: string
          applicationId: string
          churchScore: number
          createdAt: string
          financialScore: number
          id: string
          notes: string | null
          totalScore: number
          updatedAt: string
        }
        Insert: {
          academicScore?: number
          adminUserId: string
          applicationId: string
          churchScore?: number
          createdAt?: string
          financialScore?: number
          id: string
          notes?: string | null
          totalScore?: number
          updatedAt: string
        }
        Update: {
          academicScore?: number
          adminUserId?: string
          applicationId?: string
          churchScore?: number
          createdAt?: string
          financialScore?: number
          id?: string
          notes?: string | null
          totalScore?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Assessment_adminUserId_fkey"
            columns: ["adminUserId"]
            isOneToOne: false
            referencedRelation: "AdminUser"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Assessment_applicationId_fkey"
            columns: ["applicationId"]
            isOneToOne: false
            referencedRelation: "Application"
            referencedColumns: ["id"]
          },
        ]
      }
      Budget: {
        Row: {
          allocated: number
          category: string
          createdAt: string
          description: string | null
          id: string
          quarter: number | null
          spent: number
          updatedAt: string
          year: number
        }
        Insert: {
          allocated: number
          category: string
          createdAt?: string
          description?: string | null
          id: string
          quarter?: number | null
          spent?: number
          updatedAt: string
          year: number
        }
        Update: {
          allocated?: number
          category?: string
          createdAt?: string
          description?: string | null
          id?: string
          quarter?: number | null
          spent?: number
          updatedAt?: string
          year?: number
        }
        Relationships: []
      }
      Donation: {
        Row: {
          createdAt: string
          donationType: string
          donorAddress: string | null
          donorEmail: string | null
          donorName: string
          donorPhone: string | null
          id: string
          isAnonymous: boolean
          notes: string | null
          purpose: string | null
          receiptIssued: boolean
          receiptNumber: string | null
          transactionId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          donationType: string
          donorAddress?: string | null
          donorEmail?: string | null
          donorName: string
          donorPhone?: string | null
          id: string
          isAnonymous?: boolean
          notes?: string | null
          purpose?: string | null
          receiptIssued?: boolean
          receiptNumber?: string | null
          transactionId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          donationType?: string
          donorAddress?: string | null
          donorEmail?: string | null
          donorName?: string
          donorPhone?: string | null
          id?: string
          isAnonymous?: boolean
          notes?: string | null
          purpose?: string | null
          receiptIssued?: boolean
          receiptNumber?: string | null
          transactionId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Donation_transactionId_fkey"
            columns: ["transactionId"]
            isOneToOne: true
            referencedRelation: "Transaction"
            referencedColumns: ["id"]
          },
        ]
      }
      FamilyInfo: {
        Row: {
          applicantId: string
          fatherAddress: string | null
          fatherChildrenAges: string | null
          fatherChurchDuties: string | null
          fatherChurchPosition: string | null
          fatherEmployer: string | null
          fatherFirstName: string | null
          fatherIncome: string | null
          fatherLga: string | null
          fatherMiddleName: string | null
          fatherNumChildren: number | null
          fatherObligations: string | null
          fatherOccupation: string | null
          fatherPhone: string | null
          fatherSalaryGrade: string | null
          fatherSpouse: string | null
          fatherState: string | null
          fatherSurname: string | null
          fatherTown: string | null
          fatherYearsServed: string | null
          id: string
          motherAddress: string | null
          motherChildrenAges: string | null
          motherChurchDuties: string | null
          motherChurchPosition: string | null
          motherEmployer: string | null
          motherFirstName: string | null
          motherIncome: string | null
          motherLga: string | null
          motherMiddleName: string | null
          motherNumChildren: number | null
          motherObligations: string | null
          motherOccupation: string | null
          motherPhone: string | null
          motherSalaryGrade: string | null
          motherSpouse: string | null
          motherState: string | null
          motherSurname: string | null
          motherTown: string | null
          motherYearsServed: string | null
        }
        Insert: {
          applicantId: string
          fatherAddress?: string | null
          fatherChildrenAges?: string | null
          fatherChurchDuties?: string | null
          fatherChurchPosition?: string | null
          fatherEmployer?: string | null
          fatherFirstName?: string | null
          fatherIncome?: string | null
          fatherLga?: string | null
          fatherMiddleName?: string | null
          fatherNumChildren?: number | null
          fatherObligations?: string | null
          fatherOccupation?: string | null
          fatherPhone?: string | null
          fatherSalaryGrade?: string | null
          fatherSpouse?: string | null
          fatherState?: string | null
          fatherSurname?: string | null
          fatherTown?: string | null
          fatherYearsServed?: string | null
          id: string
          motherAddress?: string | null
          motherChildrenAges?: string | null
          motherChurchDuties?: string | null
          motherChurchPosition?: string | null
          motherEmployer?: string | null
          motherFirstName?: string | null
          motherIncome?: string | null
          motherLga?: string | null
          motherMiddleName?: string | null
          motherNumChildren?: number | null
          motherObligations?: string | null
          motherOccupation?: string | null
          motherPhone?: string | null
          motherSalaryGrade?: string | null
          motherSpouse?: string | null
          motherState?: string | null
          motherSurname?: string | null
          motherTown?: string | null
          motherYearsServed?: string | null
        }
        Update: {
          applicantId?: string
          fatherAddress?: string | null
          fatherChildrenAges?: string | null
          fatherChurchDuties?: string | null
          fatherChurchPosition?: string | null
          fatherEmployer?: string | null
          fatherFirstName?: string | null
          fatherIncome?: string | null
          fatherLga?: string | null
          fatherMiddleName?: string | null
          fatherNumChildren?: number | null
          fatherObligations?: string | null
          fatherOccupation?: string | null
          fatherPhone?: string | null
          fatherSalaryGrade?: string | null
          fatherSpouse?: string | null
          fatherState?: string | null
          fatherSurname?: string | null
          fatherTown?: string | null
          fatherYearsServed?: string | null
          id?: string
          motherAddress?: string | null
          motherChildrenAges?: string | null
          motherChurchDuties?: string | null
          motherChurchPosition?: string | null
          motherEmployer?: string | null
          motherFirstName?: string | null
          motherIncome?: string | null
          motherLga?: string | null
          motherMiddleName?: string | null
          motherNumChildren?: number | null
          motherObligations?: string | null
          motherOccupation?: string | null
          motherPhone?: string | null
          motherSalaryGrade?: string | null
          motherSpouse?: string | null
          motherState?: string | null
          motherSurname?: string | null
          motherTown?: string | null
          motherYearsServed?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FamilyInfo_applicantId_fkey"
            columns: ["applicantId"]
            isOneToOne: false
            referencedRelation: "Applicant"
            referencedColumns: ["id"]
          },
        ]
      }
      Transaction: {
        Row: {
          amount: number
          budgetId: string | null
          category: string
          createdAt: string
          createdBy: string | null
          date: string
          description: string
          id: string
          reference: string | null
          type: string
          updatedAt: string
        }
        Insert: {
          amount: number
          budgetId?: string | null
          category: string
          createdAt?: string
          createdBy?: string | null
          date: string
          description: string
          id: string
          reference?: string | null
          type: string
          updatedAt: string
        }
        Update: {
          amount?: number
          budgetId?: string | null
          category?: string
          createdAt?: string
          createdBy?: string | null
          date?: string
          description?: string
          id?: string
          reference?: string | null
          type?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Transaction_budgetId_fkey"
            columns: ["budgetId"]
            isOneToOne: false
            referencedRelation: "Budget"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
