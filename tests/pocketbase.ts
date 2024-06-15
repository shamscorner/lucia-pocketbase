import { testAdapter, databaseUser } from '@lucia-auth/adapter-test';
import PocketBase from 'pocketbase';
import { PocketbaseAdapter } from '$lib/index.js';

const client = new PocketBase('http://127.0.0.1:8090');

const adapter = new PocketbaseAdapter(client);

await client.admins.authWithPassword('hossains159@gmail.com', 'pocket@123');

await client.collection('users').create({
	id: databaseUser.id,
	password: 'Pocket@123',
	passwordConfirm: 'Pocket@123',
	...databaseUser.attributes
});

await testAdapter(adapter);

await client.collection('users').delete(databaseUser.id);
client.authStore.clear();

process.exit(0);

declare module 'lucia' {
	interface Register {
		DatabaseUserAttributes: {
			username: string;
		};
	}
}
