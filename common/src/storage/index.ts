import firebase from 'firebase/app'

import { CodeeContext } from '../context'
import { Dao, New, ProblemResult } from '../dao'

import { AVATARS, SUBMISSIONS } from './schema'

type Storage = firebase.storage.Storage

export class StorageDao {
  constructor(private readonly context: CodeeContext, private readonly dao: Dao, private readonly storage: Storage, private readonly storageBucket: string) {}

  async updateAvatar(userId: string, data: File): Promise<void> {
    // Upload the file to Storage
    const avatarUrl = await this.storage
      .ref(AVATARS)
      .child(userId)
      .put(data)
      .then(async (task) => {
        return await task.ref.getDownloadURL()
      })

    // Save to DAO
    return await this.dao.updateAvatar(userId, avatarUrl)
  }

  async createSubmission(courseId: string, activityId: string, problemId: string, userId: string, files: File[], language: string): Promise<string | { error: string }> {
    // Calculate storage path
    const randomElement = this.context.getGuid()
    const folderPath = `${SUBMISSIONS}/${activityId}/${problemId}/${userId}/${randomElement}`

    // Upload files
    let fileRefs
    try {
      const promises: Array<Promise<string>> = files.map(async file => {
        const path = `${folderPath}/${file.name}`
        return await this.storage.ref(path).put(file)
          .then(() => `gs://${this.storageBucket}/${path}`)
      })
      fileRefs = await Promise.all(promises)
    } catch (error) {
      console.error(error)
      return { error: 'Upload failed' }
    }

    // Save data
    const problemResult: New<ProblemResult> = {
      problemId,
      language,
      fileRefs
    }
    return await this.dao.createSubmission(courseId, activityId, userId, problemResult)
  }
}
