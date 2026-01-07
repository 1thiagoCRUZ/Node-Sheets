import dotenv from "dotenv";

dotenv.config()

export const ENV = {
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    SHEET_NAME_RESUMO: process.env.SHEET_NAME_RESUMO,
    SHEET_NAME_ANALISTAS: process.env.SHEET_NAME_ANALISTAS,
    CALLBOX_LOGIN_URL: process.env.CALLBOX_LOGIN_URL,
    CALLBOX_USER: process.env.CALLBOX_USER,
    CALLBOX_PASS: process.env.CALLBOX_PASS,
    PORT: process.env.PORT
};