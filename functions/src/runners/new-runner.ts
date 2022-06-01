
import { RegResponseBody } from '@codee-club/common/dist/api-runners'
import { CONFIG, CONFIG_LANGUAGES, ConfigLanguages, Runner, RunnerLanguage } from '@codee-club/common/dist/dao'
import { toTitleCase } from '@codee-club/common/dist/utils/string-cases'

import { db } from '../_services/firebase-admin-initialized'
import { getToken } from '../_services/gcp/get-token'
import { get } from '../_services/request-helpers/get-post'
import { DocumentCreatedHandler } from '../types'

export const onCreateRunner: DocumentCreatedHandler = async (snapshot, _context) => {
  const runner = snapshot.data() as Pick<Runner, 'url'>
  const url = `${runner.url}/`
  const token = await getToken(url)
  const headers = { Authorization: `Bearer ${token}` }

  const response = await get<RegResponseBody>({ url, headers })
    .catch(error => {
      console.error(error)
      throw error
    })
  const languages = response.body.languages
  console.info('Registering:', languages)

  // TODO Chaz: Move to a DAO
  await snapshot.ref.update({ languages })
  await updateLanguages(url, languages)
}

const updateLanguages = async (baseUrl: string, languages: RunnerLanguage[]): Promise<unknown> => {
  // TODO Chaz: Move to a DAO
  const configLanguages: ConfigLanguages = Object.fromEntries(
    languages.map(({ name, version, path }) => {
      const versionMajorMinor = version.split('.').slice(0, 2)
      const url = `${baseUrl}${path}`
      const key = `${name.toLowerCase()}-${versionMajorMinor.join('-')}` // TODO: Extract key calculation
      const label = `${toTitleCase(name)} ${versionMajorMinor.join('.')}`

      return [key, { name, version, label, url }]
    })
  )

  return db.collection(CONFIG).doc(CONFIG_LANGUAGES).set(configLanguages, { merge: true })
}
