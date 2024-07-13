import { generateRandomString, alphabet } from 'oslo/crypto';
import { it, expect, afterAll } from 'vitest';
import PocketBase from 'pocketbase';
import { PocketbaseAdapter } from '$lib/index.js';
import type { DatabaseSession } from 'lucia';

const client = new PocketBase('http://127.0.0.1:8090');

const databaseUser = {
	id: generateRandomString(15, alphabet('0-9', 'a-z')),
	attributes: {
		username: generateRandomString(15, alphabet('0-9', 'a-z'))
	}
};

const admin = {
	username: 'hossains159@gmail.com',
	password: 'pocket@123'
};

const adapter = new PocketbaseAdapter(client, {
	adminUsername: admin.username,
	adminPassword: admin.password
});

await client.admins.authWithPassword(admin.username, admin.password);

await client.collection('users').create({
	id: databaseUser.id.slice(0, 15),
	password: 'Pocket@123',
	passwordConfirm: 'Pocket@123',
	attributes: databaseUser.attributes
});

const databaseSession: DatabaseSession = {
	userId: databaseUser.id,
	id: generateRandomString(15, alphabet('0-9', 'a-z')),
	// get random date with 0ms
	expiresAt: new Date(Math.floor(Date.now() / 1000) * 1000 + 10_000),
	attributes: {
		country: 'us'
	}
};

afterAll(async () => {
	const users = await client.collection('users').getFullList();

	users.forEach((user) => {
		client.collection('users').delete(user.id);
	});
});

it('getSessionAndUser() returns [null, null] on invalid session id', async () => {
	const result = await adapter.getSessionAndUser(databaseSession.id);
	expect(result).toEqual([null, null]);
});

it('getUserSessions() returns empty array on invalid user id', async () => {
	const result = await adapter.getUserSessions(databaseUser.id);
	expect(result).toEqual([]);
});

it('setSession() creates session and getSessionAndUser() returns created session and associated user', async () => {
	await adapter.setSession(databaseSession);
	const result = await adapter.getSessionAndUser(databaseSession.id);
	expect(result).toEqual([databaseSession, databaseUser]);
});

it('getUserSessions() returns sessions array for user', async () => {
	const result = await adapter.getUserSessions(databaseSession.userId);
	expect(result).toEqual([
		{
			...databaseSession
		}
	]);
});

it('deleteSession() deletes session', async () => {
	await adapter.deleteSession(databaseSession.id);
	const result = await adapter.getUserSessions(databaseSession.userId);
	expect(result).toEqual([]);
});

it('updateSessionExpiration() updates session', async () => {
	await adapter.setSession(databaseSession);
	const d = new Date(Math.floor(Date.now() / 1000) * 1000 + 10_000);
	databaseSession.expiresAt = new Date(d.getTime() + 10_000);
	await adapter.updateSessionExpiration(databaseSession.id, databaseSession.expiresAt);
	const result = await adapter.getSessionAndUser(databaseSession.id);
	expect(result).toEqual([databaseSession, databaseUser]);
});

it('deleteExpiredSessions() deletes all expired sessions', async () => {
	const expiredSession: DatabaseSession = {
		userId: databaseUser.id,
		id: generateRandomString(15, alphabet('0-9', 'a-z')),
		expiresAt: new Date(Math.floor(Date.now() / 1000) * 1000 - 10_000),
		attributes: {
			country: 'us'
		}
	};
	await adapter.setSession(expiredSession);
	await adapter.deleteExpiredSessions();
	const result = await adapter.getUserSessions(databaseSession.userId);
	expect(result).toEqual([databaseSession]);
});

it('deleteUserSessions() deletes all user sessions', async () => {
	await adapter.deleteUserSessions(databaseSession.userId);
	const result = await adapter.getUserSessions(databaseSession.userId);
	expect(result).toEqual([]);
});
