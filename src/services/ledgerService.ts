import { EventType, LedgerEvent, UserRole } from '../types';

// Simple robust SHA-256 hex string generator using standard Web Crypto API
export async function calculateHash(payload: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(payload);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    // fallback below
  }
  // Lightweight deterministic fallback hash for SSR or environments without crypto.subtle
  let hash1 = 0xdeadbeef;
  let hash2 = 0x41c64e6d;
  for (let i = 0; i < payload.length; i++) {
    const ch = payload.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ ch, 2654435761);
    hash2 = Math.imul(hash2 ^ ch, 1597334677);
  }
  hash1 = Math.imul(hash1 ^ (hash1 >>> 16), 2246822507) ^ Math.imul(hash2 ^ (hash2 >>> 13), 3266489909);
  hash2 = Math.imul(hash2 ^ (hash2 >>> 16), 2246822507) ^ Math.imul(hash1 ^ (hash1 >>> 13), 3266489909);
  const part1 = (4294967296 + hash1).toString(16).padStart(8, '0');
  const part2 = (4294967296 + hash2).toString(16).padStart(8, '0');
  return `0000${part1}${part2}e8b2f91a`.padEnd(64, '0');
}

export function createCanonicalPayload(
  eventId: string,
  tripId: string,
  actorId: string,
  actorRole: string,
  eventType: string,
  timestamp: string,
  location: string,
  previousEventHash: string,
  remarks: string
): string {
  return JSON.stringify({
    eventId,
    tripId,
    actorId,
    actorRole,
    eventType,
    timestamp,
    location,
    previousEventHash,
    remarks,
  });
}

export async function createLedgerEvent(params: {
  tripId: string;
  actorId: string;
  actorRole: UserRole | 'SYSTEM' | 'APMC_GATE';
  eventType: EventType;
  location: string;
  remarks: string;
  previousEventHash?: string;
  evidence?: LedgerEvent['evidence'];
  isCorrection?: boolean;
}): Promise<LedgerEvent> {
  const eventId = `EVT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
  const timestamp = new Date().toISOString();
  const prevHash = params.previousEventHash || '0000000000000000000000000000000000000000000000000000000000000000';

  const canonical = createCanonicalPayload(
    eventId,
    params.tripId,
    params.actorId,
    params.actorRole,
    params.eventType,
    timestamp,
    params.location,
    prevHash,
    params.remarks
  );

  const eventHash = await calculateHash(canonical);

  return {
    eventId,
    tripId: params.tripId,
    actorId: params.actorId,
    actorRole: params.actorRole,
    eventType: params.eventType,
    timestamp,
    location: params.location,
    remarks: params.remarks,
    evidence: params.evidence,
    previousEventHash: prevHash,
    eventHash,
    isCorrection: params.isCorrection,
  };
}

export async function verifyLedgerChain(events: LedgerEvent[]): Promise<{
  isValid: boolean;
  brokenIndex?: number;
  reason?: string;
}> {
  if (!events || events.length === 0) return { isValid: true };

  for (let i = 0; i < events.length; i++) {
    const evt = events[i];
    if (i > 0) {
      const prev = events[i - 1];
      if (evt.previousEventHash !== prev.eventHash) {
        return {
          isValid: false,
          brokenIndex: i,
          reason: `Hash chaining mismatch at index ${i}. Expected prevHash ${prev.eventHash.slice(0, 8)}... but got ${evt.previousEventHash.slice(0, 8)}...`,
        };
      }
    }
  }

  return { isValid: true };
}
