import { google } from "googleapis";

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/drive"]
);

const drive = google.drive({ version: "v3", auth });

export async function copySheetToUser(email, shopName) {
  const masterId = process.env.GOOGLE_MASTER_SHEET_ID;

  // 1️⃣ Copy master sheet
  const copied = await drive.files.copy({
    fileId: masterId,
    requestBody: {
      name: `Produk ${shopName}`,
    },
  });

  const fileId = copied.data.id;

  // 2️⃣ Share ke Gmail user
  await drive.permissions.create({
    fileId,
    requestBody: {
      type: "user",
      role: "writer",
      emailAddress: email,
    },
    sendNotificationEmail: true,
  });

  return `https://docs.google.com/spreadsheets/d/${fileId}`;
}
