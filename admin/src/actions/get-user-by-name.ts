import chalk from 'chalk'
import { DeepRequired } from 'ts-essentials'

import { User, USERS, VueFire } from '@codee-club/common/dist/dao'
import { valueWithId } from '@codee-club/common/dist/utils/object-extensions'
import { fixName } from '@codee-club/common/dist/utils/string-cases'

import admin from '~/firebase-admin-initialized'
import { productionWarning } from '~/modes'

const db = admin.firestore()

const findByProperty = async <T> (collection: string, value: string, prop: string & keyof T): Promise<Array<VueFire<T>>> => {
  if (value.length === 0) return []
  return await db.collection(collection)
    .where(prop, '>=', value)
    .where(prop, '<', value.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1)))
    .get()
    .then(snap => snap.docs.map(doc => valueWithId([doc.id, doc.data() as DeepRequired<T>])))
    .catch(error => {
      console.error(error)
      return [] as Array<VueFire<T>>
    })
}

const main = async (): Promise<void> => {
  await productionWarning(__filename)

  // Get & clean inputs
  const inputName = process.argv.find(arg => arg.startsWith('--name='))?.split('--name=')[1]
  if (!inputName) return console.error(chalk.red('You must specify a name with --name=NAME or --name="FIRST LAST"'))

  const { nameFirst, nameLast } = fixName(inputName.replace(/"/, ''))
  console.info('Searching for:', nameFirst, nameLast)

  // Query
  const resultsFirst = findByProperty<User>(USERS, nameFirst, 'nameFirst')
  const resultsLast = findByProperty<User>(USERS, nameLast.length > 0 ? nameLast : nameFirst, 'nameLast')
  const allResults = [...(await resultsFirst), ...(await resultsLast)]
    .sort((u1, u2) => u1.name.localeCompare(u2.name))

  console.info(`--- ${allResults.length} result${allResults.length === 1 ? '' : 's'} ---`)
  allResults.forEach(user => console.info(`${user.id} - ${user.name}`))
}

main()
  .then(() => process.exit())
  .catch((error) => console.error(error))
