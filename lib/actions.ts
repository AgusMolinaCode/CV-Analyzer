"use server";

import { auth } from "@clerk/nextjs/server";

export async function uploadPDF(formData: FormData) {
  const { userId } = await auth();

  console.log(userId);
  try {
    const file = formData.get("file") as File;
    const clerkId = userId || "";

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (!clerkId) {
      return { success: false, error: "User ID is required" };
    }

    if (file.type !== "application/pdf") {
      return { success: false, error: "Only PDF files are allowed" };
    }

    // Prepare FormData for webhook
    const webhookFormData = new FormData();
    webhookFormData.append("file", file);
    webhookFormData.append("clerk_id", clerkId);

    // Send POST request to webhook
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      return { success: false, error: "Webhook URL not configured" };
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      body: webhookFormData,
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status: ${response.status}`);
    }

    const webhookResult = await response.json();

    return {
      success: true,
      message: "PDF uploaded and processed successfully",
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      userId: clerkId,
      webhookResponse: webhookResult,
    };
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return {
      success: false,
      error:
        "Failed to upload PDF: " +
        (error instanceof Error ? error.message : "Unknown error"),
    };
  }
}
