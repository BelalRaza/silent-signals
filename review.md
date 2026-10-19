# MongoDB first steps for Silent Signal

You can access your old Atlas account. We will begin by locating it; no new account is needed.

**Step 1 — locate what already exists**

1. Open [MongoDB Atlas](https://cloud.mongodb.com/) and sign in.
2. Check the organization selector and project selector. Select the project you previously used for this app, if you recognize it.
3. Open the database cluster list. Depending on the Atlas interface, this may be labelled Database or Clusters.
4. Note the cluster name and its displayed status: running, paused, provisioning, or no cluster shown.

At this checkpoint, share only the project/cluster name and status, or say that no cluster appears. Do not send passwords or a connection string. If there are several projects, we can identify the right one together.

**Later checkpoints — do one at a time**

| Checkpoint | What we will do | Success signal |
| --- | --- | --- |
| Database user | Find or create a database login for the app, with read/write access to the chosen development database. This is separate from your Atlas website login. | The database user is listed with the intended access. |
| Network access | Add your current local public IP to the project's IP access list. | Your address is listed. |
| Connection string | Open the chosen cluster's Connect dialog, choose Drivers / Node.js, and copy its provided URI into a local environment file. Include the intended database name. Encode special characters in credentials. | The URI is saved locally as MONGODB_URI. |
| Connection check | Run a small database ping after fixing the helper's process-exit behavior. | A successful ping without printing the URI. |
| Authentication | Set a fresh local NEXTAUTH_SECRET and NEXTAUTH_URL for the local port. | NextAuth session endpoints behave correctly. |
| Verification email | Configure the app's actual Gmail/Nodemailer path or deliberately replace it with one provider. | A code reaches your test inbox. |
| Full app flow | Sign up, verify, log in, send yourself a test message in a separate browser session, read it, pause messages, and delete it. | Each step works and failures give helpful feedback. |

Atlas requires both a database user and an allowed source IP, as described in [MongoDB's connection guide](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/). The [quick-start access guide](https://www.mongodb.com/docs/atlas/security/quick-start/) explains credential encoding and network access.

**Environment file shape, for the connection stage**

The project does not currently include an environment template. These are placeholders only; this file has not been created inside your project.

```dotenv
MONGODB_URI="mongodb+srv://<database-user>:<encoded-password>@<atlas-host>/<database-name>?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<fresh-random-local-secret>"

# Required by the current signup email helper:
GMAIL_USER="<sender@gmail.com>"
GMAIL_PASS="<gmail-app-password>"
```

Save real values only in /Users/belalraza/Desktop/appDev/silent-signals/.env.local when we reach that checkpoint. Never add a NEXT_PUBLIC_ prefix to these secrets.

The current email implementation uses Gmail, despite an unused Resend client in the repository. For password-based Gmail SMTP, use an app password where your account supports it; Google's [app-password instructions](https://support.google.com/accounts/answer/185833?hl=EN) explain the two-step verification prerequisite. We will test this separately from MongoDB.

A newly chosen development database can use Mongoose's existing schema; it does not need a manually recreated SQL-style table structure. We will inspect old data and indexes before making changes.

**Troubleshooting when we reach the ping**

| Symptom | First thing to inspect |
| --- | --- |
| Invalid connection string scheme | MONGODB_URI is missing or does not begin with mongodb:// or mongodb+srv://. This is the failure reproduced in the audit. |
| Authentication failure | Database username/password, credential encoding, and the selected cluster. |
| Connection timeout | Cluster status, the source IP access list, and network reachability. |
| DNS / SRV lookup failure | The copied hostname and local DNS/network. |
| Inbox aggregation fails on an old server | The existing code uses $sortArray, introduced in MongoDB 5.2. See [MongoDB's operator reference](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sortarray/). |

Database connection success and email delivery success are separate checkpoints.


