import webpush from "web-push";

let configured = false;
function ensureConfigured() {
  if (configured) return;
  webpush.setVapidDetails(
    "mailto:esatakpunar@outlook.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  configured = true;
}

export interface PushTarget {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

/** Tek bir aboneliğe bildirim gönderir. 410/404 (abonelik artık geçersiz)
 * dönerse true/false ile bunu bildirir, çağıran taraf DB'den silsin diye. */
export async function sendPush(
  target: PushTarget,
  payload: { title: string; body: string; url?: string },
): Promise<{ ok: boolean; expired: boolean }> {
  ensureConfigured();
  try {
    await webpush.sendNotification(
      {
        endpoint: target.endpoint,
        keys: { p256dh: target.p256dh, auth: target.auth },
      },
      JSON.stringify(payload),
    );
    return { ok: true, expired: false };
  } catch (err) {
    const statusCode = (err as { statusCode?: number }).statusCode;
    const expired = statusCode === 404 || statusCode === 410;
    if (!expired) console.error("Push gönderimi başarısız", err);
    return { ok: false, expired };
  }
}
