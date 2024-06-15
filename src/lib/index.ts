import type { Adapter, DatabaseSession, DatabaseUser } from 'lucia';
import PocketBase from 'pocketbase';

export type PocketbaseAdapterOptions = {
	adminUsername: string;
	adminPassword: string;
};

export class PocketbaseAdapter implements Adapter {
	private pb: PocketBase;
	private adminUser = {
		username: '',
		password: ''
	};

	constructor(pb: PocketBase, { adminUsername, adminPassword }: PocketbaseAdapterOptions) {
		this.pb = pb;
		this.adminUser.username = adminUsername;
		this.adminUser.password = adminPassword;
	}

	async loginAsAdmin() {
		const { username, password } = this.adminUser;
		return await this.pb.admins.authWithPassword(username, password);
	}

	async getSessionAndUser(
		sessionId: string
	): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
		try {
			await this.loginAsAdmin();

			const session = await this.pb
				.collection('sessions')
				.getOne<DatabaseSession>(this.sliceId(sessionId));
			if (!session) return [null, null];

			const user = await this.pb
				.collection('users')
				.getOne<DatabaseUser>(this.sliceId(session.userId));
			if (!user) return [null, null];

			return [
				{
					id: this.sliceId(session.id),
					userId: this.sliceId(session.userId),
					expiresAt: session.expiresAt,
					attributes: session.attributes
				},
				{
					id: this.sliceId(user.id),
					attributes: user.attributes
				}
			];
		} catch {
			return [null, null];
		}
	}

	async getUserSessions(userId: string): Promise<DatabaseSession[]> {
		try {
			await this.loginAsAdmin();

			const user = await this.pb.collection('users').getOne(userId);
			if (!user) return [];

			const sessions = await this.pb.collection('sessions').getFullList<DatabaseSession>({
				filter: this.pb.filter('userId ~ {:userId}', { userId }),
				fields: 'id, userId, expiresAt, attributes'
			});
			if (!sessions) return [];

			return sessions;
		} catch {
			return [];
		}
	}

	async setSession(session: DatabaseSession): Promise<void> {
		await this.loginAsAdmin();

		await this.pb.collection('sessions').create({
			id: this.sliceId(session.id),
			userId: this.sliceId(session.userId),
			expiresAt: new Date(session.expiresAt),
			attributes: session.attributes
		});
	}

	async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
		await this.loginAsAdmin();

		await this.pb.collection('sessions').update(sessionId, { expiresAt });
	}

	async deleteSession(sessionId: string): Promise<void> {
		await this.loginAsAdmin();

		await this.pb
			.collection('sessions')
			.delete(sessionId)
			.catch(() => null);
	}

	async deleteUserSessions(userId: string): Promise<void> {
		await this.loginAsAdmin();

		const sessions = await this.pb.collection('sessions').getFullList({
			filter: this.pb.filter('userId ~ {:userId}', { userId })
		});

		if (!sessions) return;

		for (const session of sessions) {
			await this.pb
				.collection('sessions')
				.delete(session.id)
				.catch(() => null);
		}
	}

	async deleteExpiredSessions(): Promise<void> {
		await this.loginAsAdmin();

		const sessions = await this.pb.collection('sessions').getFullList({
			filter: this.pb.filter('expiresAt < {:now}', { now: new Date() })
		});

		if (!sessions) return;

		for (const session of sessions) {
			await this.pb
				.collection('sessions')
				.delete(session.id)
				.catch(() => null);
		}
	}

	sliceId(id: string) {
		return id.slice(0, 15);
	}
}
