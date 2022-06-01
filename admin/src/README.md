# Scripts

## Actions

Scripts that might be run multiple times

- `download-scores-csv COURSE_SLUG ACTIVITY_SLUG [--strict]` - saves the scores of each student for an activity (by default doesn't follow the deadline, use `--strict` to get the score at the time of the deadline)
- `fix-activity-result-user-data` - updates user names and avatars on the activity results (keeps leaderboards consistent with user data)
- `fix-user-names` - corrects casing on user names
- `refresh-statistics` - update the home statistics by recounting all members and submissions

## Migrations

- Scripts that update the database schema incrementally to the latest version
- Named by sequence
- _Ex: `1-01-populate-configuration`_

## Seeders

- Scripts that should only be run once; focus on loading data
- Named by date
- _Ex: `201208-course-oop`_

## TODO

- TODO: Write a patch framework that logs whether the patch has been run previously _`[seeders & migrations only]`_
- TODO: Consider checking whether the patch was previously tested on `dev` before allowing on `prod` _`[seeders & migrations only]`_
- TODO: Consider preconditions, e.g. current migration version must be `x.y.z` _`[migrations only]`_
