import type {
	Adapter,
	DatabaseSession,
	RegisteredDatabaseSessionAttributes,
	DatabaseUser,
	RegisteredDatabaseUserAttributes,
	UserId
} from 'lucia';
import PocketBase from 'pocketbase';

export class PocketbaseAdapter implements Adapter {
	private pb: PocketBase;

	constructor(pb: PocketBase) {
		this.pb = pb;
	}

	getSessionAndUser(
		sessionId: string
	): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
		throw new Error('Method not implemented.');
	}
	getUserSessions(userId: string): Promise<DatabaseSession[]> {
		throw new Error('Method not implemented.');
	}
	setSession(session: DatabaseSession): Promise<void> {
		throw new Error('Method not implemented.');
	}
	updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
		throw new Error('Method not implemented.');
	}
	deleteSession(sessionId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	deleteUserSessions(userId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	deleteExpiredSessions(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
