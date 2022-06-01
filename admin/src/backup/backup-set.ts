import { Stats } from 'fs'
import fs from 'fs/promises'
import inquirer from 'inquirer'
import path from 'path'

const main = async (): Promise<void> => {
  // Base paths
  const pathToRoot = '../../..'
  const pathBackupDirectory = path.resolve(__dirname, pathToRoot, 'backups')
  await fs.mkdir(pathBackupDirectory, { recursive: true })

  // Read current config
  const configFilename = 'firebase-export-metadata.json'
  const configPath = path.resolve(pathBackupDirectory, configFilename)
  const currentBackup = await fs.readFile(configPath).then(data => JSON.parse(data.toString()).firestore.path).catch(() => '')

  // Find most recent backup (or firebase-export-metadata)
  const directoryNames = (await fs.readdir(pathBackupDirectory))
    .filter(name => !name.endsWith('.json'))
    .sort()
    .reverse()
  if (directoryNames.length === 0) {
    console.warn('No backups found. Use either:\n- cd admin && yarn backup-get --mode=production\n- yarn emu --export-on-exit="./backups/my-local-backup"')
    process.exit(1)
  }

  const metaPaths = directoryNames.map(name => [name, path.resolve(pathBackupDirectory, name, `${name}.overall_export_metadata`)])
  const metaPathsAndConfig = currentBackup.length > 0 ? [[configFilename, configPath], ...metaPaths] : metaPaths
  const stats = await Promise.all(metaPathsAndConfig.map(async nameAndPath => [nameAndPath[0], await fs.stat(nameAndPath[1])] as [string, Stats]))
  const mostRecent = stats.sort((f1, f2) => f2[1].mtime.getTime() - f1[1].mtime.getTime())[0]

  const suggestedBackup = (mostRecent[0].endsWith(configFilename))
    ? currentBackup
    : mostRecent[0]

  // Ask user to pick
  const results = await inquirer.prompt([{
    name: 'selectedBackup',
    message: 'Pick the backup to import',
    type: 'list',
    choices: directoryNames.map(name => currentBackup === name ? `${name} (current)` : (suggestedBackup === name ? `${name} (latest)` : name)),
    default: directoryNames.indexOf(suggestedBackup)
  }])
  const selectedBackup: string = results.selectedBackup.replace(' (latest)', '').replace(' (current)', '')

  // Write new config
  if (selectedBackup === currentBackup) return
  const emulatorJson = {
    version: '8.4.2',
    firestore: {
      version: '1.11.4',
      path: selectedBackup,
      metadata_file: `${selectedBackup}/${selectedBackup}.overall_export_metadata`
    }
  }
  await fs.writeFile(path.resolve(pathBackupDirectory, configFilename), JSON.stringify(emulatorJson, null, 2))
}

main().catch(error => console.error(error))
