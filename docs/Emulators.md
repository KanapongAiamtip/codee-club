[Home](../README.md) | **[Emulators](Emulators.md)** | [Seeds & Migrations](Seeds-Migrations.md) | [Deployment](Deployment.md) | [Test Runners](Runners.md) | [Known Issues](Known-Issues.md)

# Firebase Emulators

Login to GCP and set project:

```
gcloud auth login
gcloud config set project codee-club
```

## Get Firestore Backups

Save emulator state as a backup:

```
yarn emu --export-on-exit=./backups/MY_BACKUP
```

Download production backups:

```sh
cd admin
yarn backup-get --mode=production
```

## Run Emulator with Backups

Run emulator with backup picker:

```sh
yarn emu-imp
```

Run emulator with last backup (no picker):

```sh
yarn emu --import backups
```

Import AND export to persist state between sessions (assumes `MY_BACKUP` is active):

```sh
yarn emu --import backups --export-on-exit="./backups/MY_BACKUP"
```
