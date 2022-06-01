import { DeepRequired } from 'ts-essentials'
import Vue from 'vue'
import Component from 'vue-class-component'

import { ACTIVITY_PROBLEM_SETS, ActivityProblemSet, Course, CourseActivity, Problem, VueFire } from '@codee-club/common/dist/dao'
import { ActivityStatus } from '@codee-club/common/dist/data-types/enums'
import { entries, values, valuesWithIds } from '@codee-club/common/dist/utils/object-extensions'
import { urlify } from '@codee-club/common/dist/utils/url-helpers'

import Routes from '@/router/routes'
import ProblemEdit from '../../Teachers/ProblemEdit/ProblemEdit.vue'

interface BuefyTableRow {
  index: number
}
interface BuefyInput extends Vue {
  focus: () => void
}

@Component({
  metaInfo(this: ActivityEdit) {
    return {}
  },
  components: { ProblemEdit }
})
export default class ActivityEdit extends Vue {
  // Editable
  isNew = true
  activityId: string | null = null
  activity: CourseActivity = {
    name: '',
    slug: '',
    seq: 0,
    deadlines: {}
  }

  problems: Array<Pick<VueFire<Problem>, 'id' | 'name' | 'seq'>> = []

  draggingRowIndex: number | undefined = undefined
  problemName = ''
  isEditModalActive = false
  modalProblemId: string = ''

  async created(): Promise<void> {
    const activitySlug = this.$route.params.activitySlug
    const activityId = entries(this.course.activities).find(([_key, value]) => value.slug === activitySlug)?.[0]
    if (activityId !== undefined) {
      this.isNew = false
      this.activityId = activityId
      this.activity = this.course.activities[activityId]
      const aps = (await this.$db.collection(ACTIVITY_PROBLEM_SETS).doc(activityId).get()).data() as DeepRequired<ActivityProblemSet>
      this.problems = valuesWithIds(aps.problems)
    } else {
      // TODO Move to the Dao
      const allSeqs = values(this.course.activities).map((a) => a.seq)
      const nextSeq = allSeqs.length > 0 ? Math.max(...allSeqs) + 1 : 1
      this.activity = { ...this.activity, status: ActivityStatus.Draft, seq: nextSeq } // URGENT: This is picking too much from `...this.activity`
    }
  }

  get course(): VueFire<Course> {
    return this.$store.getters.findCourseBySlug(this.$route.params.courseSlug)
  }

  get slug(): string {
    return urlify(this.activity.name)
  }

  get activityCanBeSaved(): boolean {
    return this.activity.name !== undefined && this.activity.name !== ''
  }

  async activityChanged(): Promise<void> {
    if (!this.activityCanBeSaved) return

    // eslint-disable-next-line unicorn/prefer-ternary
    if (this.activityId === null) {
      this.activityId = await this.$dao.createActivity(this.course.id, this.activity)
      this.isNew = false
    } else {
      await this.$dao.updateActivity(this.course.id, this.activityId, this.activity)
    }

    if (this.slug !== this.$route.params.activitySlug) {
      await this.$router.replace({ name: Routes.TeacherActivityEdit, params: { courseSlug: this.$route.params.courseSlug, activitySlug: this.slug } })
    }
  }

  focusProblem(): void {
    this.$nextTick(() => (this.$refs.problemName as BuefyInput).focus())
  }

  get nextProblemSeq(): string {
    return (this.problems.length + 1).toString()
  }

  async addProblem(): Promise<void> {
    if (this.activityId === null || this.problemName === '') return

    const problem = {
      seq: this.problems.length > 0 ? this.problems[this.problems.length - 1].seq + 1 : 1,
      name: this.problemName
    }

    const problemId = await this.$dao.createProblem(this.activityId, problem)
    this.$set(this.problems, this.problems.length, { ...problem, id: problemId })

    // Reset footer and focus
    this.problemName = ''
    this.$nextTick(() => {
      (this.$refs.problemName as BuefyInput).focus()
    })
  }

  dragstart(payload: BuefyTableRow): void {
    this.draggingRowIndex = payload.index
  }

  drop(payload: BuefyTableRow): void {
    if (this.draggingRowIndex === undefined) return
    const destinationIndex = payload.index

    // Move problem
    const problem = this.problems[this.draggingRowIndex]
    this.problems.splice(this.draggingRowIndex, 1)
    this.problems.splice(destinationIndex, 0, problem)
  }

  editProblem(id: string): void {
    this.modalProblemId = id
    this.isEditModalActive = true
  }

  // TODO Needs to be fully hydrated problem with tests, or pass in only the problemId
  get modalProblem(): Pick<VueFire<Problem>, 'id' | 'name' | 'seq'> | undefined {
    return this.problems.find((p) => p.id === this.modalProblemId)
  }
}
