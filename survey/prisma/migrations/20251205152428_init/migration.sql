-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentimentScore" INTEGER NOT NULL,
    "implementationAreas" TEXT NOT NULL,
    "concerns" TEXT NOT NULL,
    "comments" TEXT
);
