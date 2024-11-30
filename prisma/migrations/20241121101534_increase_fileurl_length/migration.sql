-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "department" VARCHAR(255) NOT NULL,
    "lineofbusiness" VARCHAR(255) NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "expectedimpact" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "submittedby" UUID,
    "lineofbusiness" VARCHAR(255) NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ideaid" UUID,
    "reviewerid" UUID,
    "stage" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "comments" TEXT,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ideaid" UUID,
    "filename" VARCHAR(255) NOT NULL,
    "fileurl" VARCHAR(1024) NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoApplicant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ideaid" UUID,
    "coapplicantname" VARCHAR(255) NOT NULL,

    CONSTRAINT "CoApplicant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_submittedby_fkey" FOREIGN KEY ("submittedby") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ideaid_fkey" FOREIGN KEY ("ideaid") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerid_fkey" FOREIGN KEY ("reviewerid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_ideaid_fkey" FOREIGN KEY ("ideaid") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CoApplicant" ADD CONSTRAINT "CoApplicant_ideaid_fkey" FOREIGN KEY ("ideaid") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
