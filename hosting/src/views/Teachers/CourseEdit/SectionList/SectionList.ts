import Vue from 'vue'
import Component from 'vue-class-component'

import { Course, CourseSection, User, USERS, VueFire } from '@codee-club/common/dist/dao'

import Import from '../Import/Import.vue'

@Component({
  metaInfo(this: SectionList) {
    return {}
  },
  components: { Import }
})
export default class SectionList extends Vue {
  sectionIndex = 0
  students: Array<VueFire<User>> = []
  isImportModalActive = false

  async mounted(): Promise<void> {
    await this.$bind('students', this.$db.collection(USERS).where('courseIds', 'array-contains', this.course.id))
  }

  get course(): VueFire<Course> {
    return this.$store.getters.findCourseBySlug(this.$route.params.courseSlug)
  }

  get sectionsSorted(): Array<VueFire<CourseSection>> {
    const sections = Object.entries(this.course.sections).map(([id, value]) => ({ id, ...value }))
    return sections.sort((s1, s2) => s1.code.localeCompare(s2.code))
  }

  get section(): VueFire<CourseSection> {
    return this.sectionsSorted[this.sectionIndex]
  }

  get studentsForSection(): Array<VueFire<User>> {
    return this.sectionIndex === -1 ? this.students : this.students.filter((student) => this.section.studentIds?.includes(student.id))
  }
}
