import { prisma } from "@/lib/prisma";

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
    try {
        const setting = await (prisma as any).systemSetting.findUnique({
            where: { key }
        });
        if (!setting) return defaultValue;
        return JSON.parse(setting.value) as T;
    } catch (e) {
        console.error(`Error parsing setting ${key}:`, e);
        return defaultValue;
    }
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
    try {
        const stringValue = JSON.stringify(value);
        await (prisma as any).systemSetting.upsert({
            where: { key },
            update: { value: stringValue },
            create: { key, value: stringValue }
        });
    } catch (e) {
        console.error(`Error saving setting ${key}:`, e);
        throw e;
    }
}
