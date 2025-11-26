-- CreateTable
CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "age" INTEGER NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "sex" TEXT NOT NULL,
    "stateOrigin" TEXT NOT NULL,
    "lga" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "parish" TEXT NOT NULL DEFAULT 'Central Cathedral Abuja',
    "prevScholarship" BOOLEAN NOT NULL DEFAULT false,
    "prevScholarshipDate" TEXT,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyInfo" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "fatherSurname" TEXT,
    "fatherFirstName" TEXT,
    "fatherMiddleName" TEXT,
    "fatherAddress" TEXT,
    "fatherPhone" TEXT,
    "fatherState" TEXT,
    "fatherLga" TEXT,
    "fatherTown" TEXT,
    "fatherOccupation" TEXT,
    "fatherEmployer" TEXT,
    "fatherSalaryGrade" TEXT,
    "fatherIncome" TEXT,
    "fatherObligations" TEXT,
    "fatherSpouse" TEXT,
    "fatherNumChildren" INTEGER,
    "fatherChildrenAges" TEXT,
    "fatherYearsServed" TEXT,
    "fatherChurchPosition" TEXT,
    "fatherChurchDuties" TEXT,
    "motherSurname" TEXT,
    "motherFirstName" TEXT,
    "motherMiddleName" TEXT,
    "motherAddress" TEXT,
    "motherPhone" TEXT,
    "motherState" TEXT,
    "motherLga" TEXT,
    "motherTown" TEXT,
    "motherOccupation" TEXT,
    "motherEmployer" TEXT,
    "motherSalaryGrade" TEXT,
    "motherIncome" TEXT,
    "motherObligations" TEXT,
    "motherSpouse" TEXT,
    "motherNumChildren" INTEGER,
    "motherChildrenAges" TEXT,
    "motherYearsServed" TEXT,
    "motherChurchPosition" TEXT,
    "motherChurchDuties" TEXT,

    CONSTRAINT "FamilyInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "schoolName" TEXT NOT NULL,
    "schoolAddress" TEXT NOT NULL,
    "presentClass" TEXT NOT NULL,
    "classPosition" TEXT,
    "classSize" INTEGER,
    "schoolFees" TEXT NOT NULL,
    "textBooksCost" TEXT,
    "enoughBooks" BOOLEAN NOT NULL DEFAULT false,
    "libraryAccess" BOOLEAN NOT NULL DEFAULT false,
    "sentAway" BOOLEAN NOT NULL DEFAULT false,
    "repeatedClass" BOOLEAN NOT NULL DEFAULT false,
    "lastResult" TEXT,
    "schoolBillUrl" TEXT,
    "birthCertUrl" TEXT,
    "primaryCertUrl" TEXT,
    "schoolResultUrl" TEXT,
    "assistanceLetterUrl" TEXT,
    "admissionLetterUrl" TEXT,
    "passportUrl" TEXT,
    "scoreFinancial" INTEGER,
    "scoreAcademic" INTEGER,
    "scoreChurch" INTEGER,
    "committeeNotes" TEXT,
    "approvedAmount" TEXT,
    "voucherCode" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyInfo_applicantId_key" ON "FamilyInfo"("applicantId");

-- AddForeignKey
ALTER TABLE "FamilyInfo" ADD CONSTRAINT "FamilyInfo_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

