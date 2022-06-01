[Home](../README.md) | [Emulators](Emulators.md) | [Seeds & Migrations](Seeds-Migrations.md) | **[Deployment](Deployment.md)** | [Test Runners](Runners.md) | [Known Issues](Known-Issues.md)

# Deployment

## Login to Google Cloud & Firebase

Authenticate & set the current project:

```
gcloud auth login
gcloud config set project codee-club-emu
gcloud auth application-default login
firebase login
firebase use default
```

## Initial Setup

See: [New Git Clone](Deployment-New-Clone.md) if you have not deployed this `clone` before.  
See: [New Firebase Project](Deployment-New-Project.md) if you need to setup a new Firebase/GCP Project.

## 1. Select project

- Set the correct project:
  ```
  firebase use [alias]
  ```

## 2. Run migrations

- Perform new migrations
  _- from `admin` -_

  ```
  yarn build
  yarn migrate --mode=[alias]
  ```

## 3. Deploy Functions

- Deploy config from `configs/functions.[alias].json`  
   _- from `admin` -_

  ```
  yarn config:deploy [alias]
  ```

- Deploy to Firebase Cloud Functions  
   _- from `functions` -_

  ```
  yarn deploy
  ```

## 4. Deploy Hosting

- Import the firebase-config using  
   _- from `admin` -_

  ```
  yarn serve "src/config/hosting-import.ts"
  ```

- Build & deploy  
  _- from `hosting` -_

  ```
  yarn build --mode=[alias]
  yarn deploy
  ```

## 5. Reset Local Workspace

- Set your project back to use the emulator:

  ```
  firebase use emu
  ```

## See also

- [Scripts](Deployment-Scripts.md)
- [Runners](Runners.md)

# Backup Firestore prod and restore to dev

1. Backup prod
   _- from `admin` -_

   ```
   yarn backup "pre user split"
   ```

2. Copy it to a dev bucket

   From the output of the step one `Backup up ... to: XYZ`, copy `XYZ` to:

   ```
   gsutil cp -r gs://codee-club-backups/XYZ gs://codee-club-dev.appspot.com/backups/XYZ
   ```

   where `XYZ` is of the form `2021-01-10-06-45-01-pre-user-split`.

3. Restore to dev

   First delete the existing database:

   ```
   firebase firestore:delete --project=codee-club-dev --all-collections
   ```

   Replace `XYZ` again:

   ```
   gcloud firestore import --project=codee-club-dev gs://codee-club-dev.appspot.com/backups/XYZ
   ```

4. Tidy up

   ```
   gsutil rm -r gs://codee-club-backups/backups/XYZ
   ```
