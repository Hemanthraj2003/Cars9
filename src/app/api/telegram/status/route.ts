import { NextResponse } from 'next/server';
import { getTelegramCredentials, isTelegramConfigured, testTelegramConnection } from '@/lib/telegram';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const configured = isTelegramConfigured();
    const creds = getTelegramCredentials();

    if (!configured) {
      return NextResponse.json({
        configured: false,
        message: 'Telegram Bot Token or Chat ID not configured',
        botTokenSet: Boolean(creds.botToken),
        chatIdSet: Boolean(creds.chatId),
      });
    }

    const test = await testTelegramConnection();
    return NextResponse.json({
      configured: true,
      ok: test.ok,
      botName: test.botName,
      username: test.username,
      error: test.error,
      chatId: creds.chatId ? `${creds.chatId.slice(0, 4)}...${creds.chatId.slice(-4)}` : null,
    });
  } catch (error: any) {
    return NextResponse.json({ configured: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { botToken, chatId } = body;

    if (typeof botToken === 'string' && botToken.trim()) {
      try {
        await db.delete(siteSettings).where(eq(siteSettings.key, 'telegram_bot_token'));
      } catch {}
      await db.insert(siteSettings).values({
        key: 'telegram_bot_token',
        value: JSON.stringify(botToken.trim())
      });
    }

    if (typeof chatId === 'string' && chatId.trim()) {
      try {
        await db.delete(siteSettings).where(eq(siteSettings.key, 'telegram_chat_id'));
      } catch {}
      await db.insert(siteSettings).values({
        key: 'telegram_chat_id',
        value: JSON.stringify(chatId.trim())
      });
    }

    const test = await testTelegramConnection();
    return NextResponse.json({
      success: true,
      connection: test,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
