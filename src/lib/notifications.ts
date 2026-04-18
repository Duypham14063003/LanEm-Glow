import nodemailer from "nodemailer";

import { assertRequiredEnv } from "@/lib/validation";
import type { NotificationDeliveryResult, OrderAdminListItem } from "@/types";

interface NotificationConfig {
  adminEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
}

function getNotificationConfig(): NotificationConfig {
  return {
    adminEmail: assertRequiredEnv("ADMIN_NOTIFY_EMAIL", process.env.ADMIN_NOTIFY_EMAIL),
    smtpHost: assertRequiredEnv("SMTP_HOST", process.env.SMTP_HOST),
    smtpPort: Number(assertRequiredEnv("SMTP_PORT", process.env.SMTP_PORT)),
    smtpUser: assertRequiredEnv("SMTP_USER", process.env.SMTP_USER),
    smtpPass: assertRequiredEnv("SMTP_PASS", process.env.SMTP_PASS),
  };
}

function isNotificationEnabled() {
  return process.env.ADMIN_NOTIFY_ENABLED?.trim().toLowerCase() !== "false";
}

function buildOrderNotificationText(order: OrderAdminListItem) {
  return [
    `Order ID: ${order.orderId}`,
    `Created At: ${order.createdAt}`,
    `Phone: ${order.phone}`,
    `Customer Name: ${order.customerName || "N/A"}`,
    `Products: ${order.selectedProductNames.join(", ") || "N/A"}`,
    `Item Count: ${order.itemCount}`,
    `Customer Note: ${order.customerNote || "N/A"}`,
    `Status: ${order.status}`,
    `Duplicate: ${order.duplicateFlag ? "Yes" : "No"}`,
    `Source Page: ${order.sourcePage || "N/A"}`,
    `Source Campaign: ${order.sourceCampaign || "N/A"}`,
  ].join("\n");
}

export async function notifyAdminOfNewOrder(
  order: OrderAdminListItem,
  overrides?: {
    sendMail?: (options: {
      to: string;
      subject: string;
      text: string;
    }) => Promise<void>;
  }
): Promise<NotificationDeliveryResult> {
  if (!isNotificationEnabled()) {
    return {
      status: "skipped",
      code: "NOTIFICATION_DISABLED",
      message: "Admin notification is disabled.",
    };
  }

  let config: NotificationConfig;

  try {
    config = getNotificationConfig();
  } catch {
    return {
      status: "skipped",
      code: "NOTIFICATION_CONFIG_MISSING",
      message: "Notification configuration is incomplete.",
    };
  }

  try {
    if (overrides?.sendMail) {
      await overrides.sendMail({
        to: config.adminEmail,
        subject: `[LanEm Glow] New order ${order.orderId}`,
        text: buildOrderNotificationText(order),
      });
    } else {
      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort === 465,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass,
        },
      });

      await transporter.sendMail({
        from: config.smtpUser,
        to: config.adminEmail,
        subject: `[LanEm Glow] New order ${order.orderId}`,
        text: buildOrderNotificationText(order),
      });
    }

    return {
      status: "sent",
      code: "NOTIFICATION_SENT",
      message: "Admin notification sent successfully.",
    };
  } catch (error) {
    console.error("Failed to send admin order notification", error);

    return {
      status: "failed",
      code: "NOTIFICATION_DELIVERY_FAILED",
      message: "Order was recorded but admin email delivery failed.",
    };
  }
}
