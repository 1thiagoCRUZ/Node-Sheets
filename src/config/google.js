import { google } from "googleapis";
import { ENV } from "./env.js";

export function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: ENV.GOOGLE_CLIENT_EMAIL,
      // Garante que o \n seja interpretado corretamente
      private_key: ENV.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}