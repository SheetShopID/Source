export function decide(logs = []) {
  if (!logs.length) {
    return { status: "FAILED", cause: "Client / Network", message: "Request tidak pernah masuk ke server." };
  }

  const last = logs[logs.length - 1].label;

  const map = {
    REGISTER_API_HIT: {
      status: "FAILED",
      cause: "Client / Network",
      message: "Request masuk tapi tidak diproses lebih lanjut."
    },
    BODY_PARSED: {
      status: "FAILED",
      cause: "Payload Invalid",
      message: "Data rusak atau tidak lengkap."
    },
    CALL_APPS_SCRIPT: {
      status: "FAILED",
      cause: "Google Apps Script",
      message: "Proses berhenti saat memanggil Apps Script."
    },
    SHEET_CREATED: {
      status: "PARTIAL",
      cause: "Firebase / Infra",
      message: "Sheet sudah dibuat, tapi website belum aktif."
    },
    REGISTER_SUCCESS: {
      status: "SUCCESS",
      cause: "—",
      message: "Website berhasil dibuat dan aktif."
    }
  };

  return map[last] || {
    status: "FAILED",
    cause: "Unknown",
    message: "Status tidak dikenali."
  };
}