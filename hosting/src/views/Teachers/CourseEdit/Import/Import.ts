import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { CourseUserImportCallable, courseUserImportId } from '@codee-club/common/dist/api-callables'
import { CourseSection, VueFire } from '@codee-club/common/dist/dao'
import { fixName } from '@codee-club/common/dist/utils/string-cases'

interface UserRaw { code: string, nameFirst: string, nameLast: string, email: string}

function parseUserRaw(line: string): UserRaw | undefined {
  const code = line.match(/\d{7}/g)
  // eslint-disable-next-line unicorn/no-unsafe-regex
  const name = line.match(/[A-Za-z]{2,} [A-Za-z]{2,}'?-?[A-Za-z]{2,}?( [A-Za-z]+)?/g)
  const email = line.match(/[\dA-Za-z]{4,}@nu\.ac\.th/g)
  if (code === null || name === null || email === null) {
    return undefined
  }
  const nameComponents = fixName(name[0])
  return {
    ...nameComponents,
    code: code[0],
    email: email[0]
  }
}

@Component({
  metaInfo(this: Import) {
    return {}
  }
})
export default class Import extends Vue {
  @Prop() courseId!: string
  @Prop() section!: VueFire<CourseSection>
  rawInput: string = ''
  parsedUsers: UserRaw[] = []
  parsedUsersImportSuccess: Array<boolean | undefined> = []
  importIsRunning = false

  @Watch('rawInput')
  rawInputChanged(value: string): void {
    const lines = value.split('\n').filter(line => line !== '')
    if (lines.length === 0) {
      return
    }
    this.parsedUsers = lines.map(line => parseUserRaw(line)).filter(user => user !== undefined) as UserRaw[]
    this.parsedUsersImportSuccess = Array.from({ length: this.parsedUsers.length })
  }

  async submit(): Promise<void> {
    this.importIsRunning = true
    const courseUserImport: CourseUserImportCallable = this.$functions.httpsCallable(courseUserImportId)
    for (const [index, user] of this.parsedUsers.entries()) {
      try {
        const { data } = await courseUserImport({ courseId: this.courseId, sectionId: this.section.id, users: [user] })
        const result = data[0]
        console.log(result)
        this.$set(this.parsedUsersImportSuccess, index, typeof result === 'string')
      } catch (error) {
        console.error(error)
        this.$set(this.parsedUsersImportSuccess, index, false)
      }
    }
    this.importIsRunning = false
    this.$emit('close')
  }
}
