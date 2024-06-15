# lucia-pocketbase

A simple adapter package to help you connect to Pocketbase from your Lucia project.

## How to use

**Step 1:**

```bash
npm i @shamscorner/lucia-pocketbase
```

**Step 2:**

Import the adapter in your project.

```javascript
import { PocketbaseAdapter } from '@shamscorner/lucia-pocketbase';

const client = new PocketBase('http://127.0.0.1:8090');
const adapter = new PocketbaseAdapter(client, {
	adminUsername: admin.username, // check pocketbase admin username
	adminPassword: admin.password // check pocketbase admin password
});
```

**Step 3:**

Follow the official [guide](https://lucia-auth.com/getting-started/) to setup your Lucia project.

## License

MIT
