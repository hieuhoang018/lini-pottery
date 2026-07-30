const TELEGRAM_API_BASE = "https://api.telegram.org"

export const sendTelegramMessage = async (text: string): Promise<void> => {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID

  if (!token || !chatId) {
    console.warn(
      "[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID not configured, skipping message",
    )
    return
  }

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      console.error("[telegram] Telegram API returned an error:", data)
    }
  } catch (err) {
    console.error("[telegram] Failed to send message:", err)
  }
}
