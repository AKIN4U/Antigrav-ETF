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
                }
                Insert: {
                    createdAt?: string
                    email: string
                    id: string
                    name?: string | null
                    role?: string
                }
                Update: {
                    createdAt?: string
                    email?: string
                    id?: string
                    name?: string | null
                    role?: string
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
                    enoughBooks: boolean
                    id: string
                    lastResult: string | null
                    libraryAccess: boolean
                    passportUrl: string | null
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
                    enoughBooks?: boolean
                    id: string
                    lastResult?: string | null
                    libraryAccess?: boolean
                    passportUrl?: string | null
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
                    enoughBooks?: boolean
                    id?: string
                    lastResult?: string | null
                    libraryAccess?: boolean
                    passportUrl?: string | null
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
                        isOneToOne: true
                        referencedRelation: "Applicant"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
