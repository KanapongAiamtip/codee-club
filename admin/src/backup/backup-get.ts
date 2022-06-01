import { File as GoogleStorageFile } from '@google-cloud/storage'
import fs from 'fs'
import inquirer from 'inquirer'
import { groupBy } from 'lodash'
import path from 'path'
import task from 'tasuku'

import { keys } from '@codee-club/common/dist/utils/object-extensions'

import { storage } from '~/firebase-admin-initialized'
import { productionWarning } from '~/modes'

const pathToRoot = '../../../'
const pathBackupDirectory = path.resolve(__dirname, pathToRoot, 'backups')

const main = async (): Promise<void> => {
  await productionWarning(__filename)

  // Get local backups
  fs.mkdirSync(pathBackupDirectory, { recursive: true })
  const backupsLocal = new Set(
    fs.readdirSync(pathBackupDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  )

  // Get cloud backups
  const bucket = 'codee-club-backups'
  const [files] = await storage.bucket(bucket).getFiles()
  const backupsCloudFiles = groupBy(files, file => file.name.split('/')[0])
  const backupsCloud = new Set(keys(backupsCloudFiles))

  // Ask what to download
  const results = await inquirer.prompt([{
    name: 'selectedBackups',
    message: 'Select backups to download (newest first)',
    type: 'checkbox',
    choices: [
      ...[...backupsCloud].sort().reverse().map(name => ({ name, checked: backupsLocal.has(name), disabled: backupsLocal.has(name) ? 'already downloaded' : false })),
      new inquirer.Separator()
    ]
  }])

  const selectedBackups: string[] = results.selectedBackups
  if (selectedBackups.length === 0) return console.log('No backups selected (press space to select)')

  // Download
  const filesToDownload: Array<[string, string]> = selectedBackups
    .flatMap((selectedBackup: string) => backupsCloudFiles[selectedBackup])
    .map((file: GoogleStorageFile) => [file.name, path.resolve(pathBackupDirectory, file.name)])

  const destinationDirectories = new Set(filesToDownload.map(pair => path.dirname(pair[1])))
  destinationDirectories.forEach(destinationDirectory => fs.mkdirSync(destinationDirectory, { recursive: true }))

  const downloadTasks = await task.group(
    task => filesToDownload.map(pair =>
      task(`Downloading: ${pair[0]}`, async () => await storage.bucket(bucket)
        .file(pair[0])
        .download({ destination: pair[1] })
      )
    ),
    { concurrency: 5 }
  )

  downloadTasks.clear()
  console.log(`Download complete (${selectedBackups.length} backups; ${filesToDownload.length} files)`)

  // Set default backup
  const latestNewBackup = selectedBackups[0]
  const emulatorJson = {
    version: '8.4.2',
    firestore: {
      version: '1.11.4',
      path: latestNewBackup,
      metadata_file: `${latestNewBackup}/${latestNewBackup}.overall_export_metadata`
    }
  }
  fs.writeFileSync(path.resolve(pathBackupDirectory, 'firebase-export-metadata.json'), JSON.stringify(emulatorJson, null, 2))
  console.log(`Updated default: ${latestNewBackup}`)
}

main().catch(error => console.error(error))
