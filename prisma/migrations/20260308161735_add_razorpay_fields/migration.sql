-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "advancePaid" DOUBLE PRECISION,
ADD COLUMN     "deliveryCharge" DOUBLE PRECISION DEFAULT 100,
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT;
