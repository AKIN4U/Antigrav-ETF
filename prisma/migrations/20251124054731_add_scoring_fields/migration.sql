/*
  Warnings:

  - You are about to drop the column `screeningScore` on the `Application` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
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
    CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("admissionLetterUrl", "applicantId", "approvedAmount", "assistanceLetterUrl", "birthCertUrl", "classPosition", "classSize", "committeeNotes", "createdAt", "enoughBooks", "id", "lastResult", "libraryAccess", "passportUrl", "presentClass", "primaryCertUrl", "repeatedClass", "schoolAddress", "schoolBillUrl", "schoolFees", "schoolName", "schoolResultUrl", "sentAway", "status", "textBooksCost", "updatedAt", "voucherCode") SELECT "admissionLetterUrl", "applicantId", "approvedAmount", "assistanceLetterUrl", "birthCertUrl", "classPosition", "classSize", "committeeNotes", "createdAt", "enoughBooks", "id", "lastResult", "libraryAccess", "passportUrl", "presentClass", "primaryCertUrl", "repeatedClass", "schoolAddress", "schoolBillUrl", "schoolFees", "schoolName", "schoolResultUrl", "sentAway", "status", "textBooksCost", "updatedAt", "voucherCode" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
