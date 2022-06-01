import { DeepRequired } from 'ts-essentials'
import Vue from 'vue'
import Component from 'vue-class-component'

import { ConfigLanguage, Course, New, VueFire } from '@codee-club/common/dist/dao'
import { entries, length, values } from '@codee-club/common/dist/utils/object-extensions'

import Routes from '@/router/routes'

import SectionList from './SectionList/SectionList.vue'

@Component({
  metaInfo(this: CourseEdit) {
    return {}
  },
  components: { SectionList }
})
export default class CourseEdit extends Vue {
  // Reference data
  themes = ['default', 'java', 'kotlin', 'swift', 'python', 'green', 'pink', 'orange', 'go']
  years = Array.from({ length: 3 }, (_, idx) => new Date().getFullYear() + idx)

  // Editable data
  isNew = true
  course: New<Course> & Partial<DeepRequired<Course>> = {
    code: '',
    name: '',
    year: new Date().getFullYear(),
    semester: 1,
    theme: this.themes[0],
    ownerIds: [this.$store.state.currentUser.id],
    roleEdit: [this.$store.state.currentUser.id]
  }

  sectionCodes: string[] = []
  allowedLanguages: Array<VueFire<ConfigLanguage>> = []

  async created(): Promise<void> {
    if (this.courseId !== undefined) {
      this.isNew = false
      this.course = { ...this.$store.getters.findCourseBySlug(this.$route.params.courseSlug) }
      this.sectionCodes = values(this.course.sections ?? {}).map(section => section.code)
      const languageIds = new Set(this.course.allowedLanguages ?? [])
      this.allowedLanguages = this.$store.getters.allLanguages.filter((language: VueFire<ConfigLanguage>) => languageIds.has(language.id))
      if (!this.years.includes(this.course.year)) this.years.push(this.course.year)
      if (this.course.theme === undefined) this.course.theme = this.themes[0]
    }
  }

  get languages(): Array<VueFire<ConfigLanguage>> {
    return this.$store.getters.allLanguages.filter((language: VueFire<ConfigLanguage>) => !this.allowedLanguages.includes(language))
  }

  get courseId(): string | undefined {
    const course = this.$store.getters.findCourseBySlug(this.$route.params.courseSlug)
    return course?.id
  }

  get slug(): string {
    return `${this.course.code}-${this.course.year.toString().slice(-2)}s${this.course.semester}`
  }

  get hasActivities(): boolean {
    return length(this.course.activities) > 0
  }

  get courseCanBeSaved(): boolean {
    return this.course.year !== undefined &&
      this.course.semester !== undefined &&
      this.course.code !== undefined &&
      this.course.code.length > 0 &&
      this.course.name !== undefined &&
      this.course.name.length > 0
  }

  async courseChanged(): Promise<void> {
    if (!this.courseCanBeSaved) return

    // TODO Sections should be created separately by calling a createSection method on the Dao
    const existingSections = entries(this.course.sections ?? {})
    const updatedSections = this.sectionCodes.map(code => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      return existingSections.find(section => section[1].code === code) ?? [this.$dao['getGuid'](), { code }]
    })

    const courseData = {
      ...this.course,
      sections: Object.fromEntries(updatedSections),
      allowedLanguages: this.allowedLanguages.map(language => language.id)
    }

    // eslint-disable-next-line unicorn/prefer-ternary
    if (this.courseId === undefined) {
      await this.$dao.createCourse(courseData)
      this.isNew = false
    } else {
      await this.$dao.updateCourse(this.courseId, courseData)
    }

    if (this.slug !== this.$route.params.courseSlug) {
      await this.$router.replace({ name: Routes.TeacherCourseEdit, params: { courseSlug: this.slug } })
    }
  }
}
