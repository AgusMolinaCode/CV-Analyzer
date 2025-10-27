"use server";

import { auth } from "@clerk/nextjs/server";

export async function uploadPDF(formData: FormData) {
  const { userId } = await auth();

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

    // Convert File to Blob and prepare FormData
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const webhookFormData = new FormData();

    // Create a proper Blob with the file data
    const blob = new Blob([buffer], { type: file.type });
    webhookFormData.append("file", blob, file.name);
    webhookFormData.append("clerk_id", clerkId);

    // Send POST request to webhook
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      return { success: false, error: "Webhook URL not configured" };
    }

    let response;
    try {
      // Create abort controller for timeout (60 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      response = await fetch(webhookUrl, {
        method: "POST",
        body: webhookFormData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (fetchError) {
      console.error("[uploadPDF] Network error:", fetchError instanceof Error ? fetchError.message : "Unknown error");
      throw fetchError;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[uploadPDF] Webhook error:", `Status ${response.status}`);
      throw new Error(`Webhook responded with status: ${response.status}`);
    }

    // Check if response has content and is JSON
    const contentType = response.headers.get("content-type");
    let webhookResult = null;
    let responseText = "";

    // Always read the response as text first
    try {
      responseText = await response.text();
    } catch (error) {
      console.error("[uploadPDF] Error reading response");
      responseText = "";
    }

    // Try to parse as JSON if content-type indicates JSON
    if (contentType && contentType.includes("application/json")) {
      if (responseText.trim()) {
        try {
          webhookResult = JSON.parse(responseText);
        } catch (error) {
          webhookResult = { message: responseText };
        }
      } else {
        webhookResult = { message: "Upload successful (empty response)" };
      }
    } else {
      // Plain text response
      webhookResult = { message: responseText || "Upload successful" };
    }

    // Check if the response contains the expected success message
    const hasSuccessMessage = responseText.includes("CV cargado correctamente") ||
                             responseText.includes("PDF processed successfully");

    return {
      success: true,
      message: hasSuccessMessage
        ? "CV cargado correctamente"
        : "PDF uploaded and processed successfully",
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      userId: clerkId,
      webhookResponse: webhookResult,
      rawResponse: responseText,
    };
  } catch (error) {
    console.error("[uploadPDF] Error:", error instanceof Error ? error.message : "Unknown error");

    // Check if it's a timeout error
    let errorMessage = "Failed to upload PDF: ";
    if (error instanceof Error) {
      if (error.name === "TimeoutError" || error.message.includes("timeout") || error.message.includes("aborted")) {
        errorMessage =
          "El servidor está procesando el PDF pero está tardando más de lo esperado. Por favor, intenta nuevamente.";
      } else if (error.message.includes("fetch") || error.message.includes("network")) {
        errorMessage =
          "Error de conexión con el servidor. Verifica tu conexión a internet.";
      } else {
        errorMessage += error.message;
      }
    } else {
      errorMessage += "Unknown error";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
