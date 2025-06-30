/*
  Warnings:

  - You are about to drop the column `subtaskId` on the `TaskAssignments` table. All the data in the column will be lost.
  - You are about to drop the column `subtaskId` on the `TaskAttachments` table. All the data in the column will be lost.
  - You are about to drop the column `subtaskId` on the `TaskComments` table. All the data in the column will be lost.
  - You are about to drop the `Subtasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subtasks" DROP CONSTRAINT "Subtasks_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Subtasks" DROP CONSTRAINT "Subtasks_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskAssignments" DROP CONSTRAINT "TaskAssignments_subtaskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskAttachments" DROP CONSTRAINT "TaskAttachments_subtaskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskComments" DROP CONSTRAINT "TaskComments_subtaskId_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_projectsId_fkey";

-- AlterTable
ALTER TABLE "TaskAssignments" DROP COLUMN "subtaskId";

-- AlterTable
ALTER TABLE "TaskAttachments" DROP COLUMN "subtaskId";

-- AlterTable
ALTER TABLE "TaskComments" DROP COLUMN "subtaskId";

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "taskId" INTEGER,
ALTER COLUMN "projectsId" DROP NOT NULL;

-- DropTable
DROP TABLE "Subtasks";

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_projectsId_fkey" FOREIGN KEY ("projectsId") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
