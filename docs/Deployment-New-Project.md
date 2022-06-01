[Home](../README.md) | [Emulators](Emulators.md) | [Seeds & Migrations](Seeds-Migrations.md) | **[Deployment](Deployment.md)** | [Test Runners](Runners.md) | [Known Issues](Known-Issues.md)

# Deployment: New Firebase Project

## Firebase Configuration

You will need to download `firebase-config.[alias].json` and `service-account.[alias].json` for the new project. See [New Clone](Deployment-New-Clone.md) for more details.

## Storage

Everyone has "Get Only" access to storage (used by runners to get submission files)

1. Create a custom role with Get Only access

   ```
   gcloud iam roles create storage.objectGetOnly --project=codee-club-dev \
   --title="Storage Object Get Only" --description="Get objects without list" \
   --permissions=storage.objects.get --stage=ALPHA
   ```

2. Assign the role to "allUsers" on the required buckets

   ```
   gsutil iam ch allUsers:projects/codee-club-dev/roles/storage.objectGetOnly gs://codee-club-dev.appspot.com
   ```

3. Check the permissions in the console or use

   ```
   gsutil iam get gs://codee-club-dev.appspot.com
   ```

   Successful result:

   ```
   {
   "bindings": [
      {
         "members": [
         "allUsers"
         ],
         "role": "projects/codee-club-dev/roles/storage.objectGetOnly"
      },
      ..
   }
   ```

## Firestore

_TODO_

- deploy security rules
