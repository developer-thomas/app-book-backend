/*
  Warnings:

  - Added the required column `numberOfGuests` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `numberOfGuests` INTEGER NOT NULL;
