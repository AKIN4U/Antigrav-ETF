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
    "disbursedDate" TIMESTAMP(3),
    "paymentReference" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'Admin',
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "financialScore" INTEGER NOT NULL DEFAULT 0,
    "academicScore" INTEGER NOT NULL DEFAULT 0,
    "churchScore" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER,
    "category" TEXT NOT NULL,
    "allocated" DECIMAL(12,2) NOT NULL,
    "spent" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT,
    "donorPhone" TEXT,
    "donorAddress" TEXT,
    "donationType" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "purpose" TEXT,
    "receiptIssued" BOOLEAN NOT NULL DEFAULT false,
    "receiptNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyInfo_applicantId_key" ON "FamilyInfo"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_applicationId_adminUserId_key" ON "Assessment"("applicationId", "adminUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_year_quarter_category_key" ON "Budget"("year", "quarter", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_transactionId_key" ON "Donation"("transactionId");

-- AddForeignKey
ALTER TABLE "FamilyInfo" ADD CONSTRAINT "FamilyInfo_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
