import dedent from 'dedent-js'
import keyBy from 'lodash/keyBy'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

import { ACTIVITY_PROBLEM_SETS, ACTIVITY_RESULTS, ActivityProblemSet, ActivityResult, ConfigLanguage, Course, CourseActivity, Problem, ProblemResult, Test, TestResult, User, VueFire } from '@codee-club/common/dist/dao'
import { ProblemResultStatus } from '@codee-club/common/dist/data-types/enums'
import { length, valuesWithIds } from '@codee-club/common/dist/utils/object-extensions'
import { randomElement } from '@codee-club/common/dist/utils/random'

import { cssClass } from '~/themes'
import ProblemEdit from '../../Teachers/ProblemEdit/ProblemEdit.vue'

@Component({
  metaInfo(this: ProblemView) {
    return this.problem !== undefined ? { title: this.problem.name } : {}
  },
  methods: { dedent },
  components: { ProblemEdit }
})
export default class ProblemView extends Vue {
  // Data
  activityProblemSet: VueFire<ActivityProblemSet> | null = null
  activityResults: Array<VueFire<ActivityResult>> = []
  selectedLanguageId: string | null = null
  dropFiles: File[] = []

  // UI state
  loadingResults = true
  uploading = false
  modalIndex: number | null = null
  isEditModalActive = false

  async mounted(): Promise<void> {
    await this.$bind('activityProblemSet', this.$db.collection(ACTIVITY_PROBLEM_SETS).doc(this.activity.id))
    await this.$bind('activityResults', this.$db.collection(ACTIVITY_RESULTS).where('userId', '==', this.user.id).where('activityId', '==', this.activity.id)).then(() => (this.loadingResults = false))
  }

  // TODO: Add route guard to check we didn't sneakily switch activity

  get user(): VueFire<User> {
    return this.$store.state.currentUser
  }

  get course(): VueFire<Course> | undefined { // TODO: If no course, bail out early
    return this.$store.getters.findCourseBySlug(this.$route.params.courseSlug)
  }

  get activity(): VueFire<CourseActivity> {
    return this.$store.getters.findActivityBySlugs(this.$route.params.courseSlug, this.$route.params.activitySlug)
  }

  get getSeq(): number {
    return Number.parseInt(this.$route.params.problemSeq)
  }

  get problemsBySeq(): { [seq: number]: VueFire<Problem> } {
    return keyBy(valuesWithIds(this.activityProblemSet?.problems), 'seq')
  }

  get problem(): VueFire<Problem> | undefined {
    return this.problemsBySeq[this.getSeq]
  }

  get testsKeyed(): { [testId: string]: Test } | undefined {
    return this.problem?.tests
  }

  get tests(): Array<VueFire<Test>> | undefined {
    return valuesWithIds(this.problem?.tests)
      .filter((t) => t.visibility === 'VISIBLE')
      .sort((t1, t2) => t1.seq - t2.seq)
  }

  get havePrev(): boolean {
    return this.getSeq > 1
  }

  get haveNext(): boolean {
    return this.getSeq < length(this.activityProblemSet?.problems)
  }

  get activityResult(): VueFire<ActivityResult> | undefined {
    return this.activityResults?.[0]
  }

  get problemResults(): Array<VueFire<ProblemResult>> {
    const problemId = this.problem?.id
    if (!problemId) return []

    const allProblemResults = valuesWithIds(this.activityResult?.problemResults)
    return allProblemResults.filter((pr) => pr.problemId === problemId).sort((pr1, pr2) => pr2.date.seconds - pr1.date.seconds)
  }

  private readonly problemResultStatusTextMap = new Map<ProblemResultStatus, string>([
    [ProblemResultStatus.Evaluating, 'Evaluating...'],
    [ProblemResultStatus.Pass, 'Pass'],
    [ProblemResultStatus.Fail, 'Tests failed'],
    [ProblemResultStatus.Invalid, 'Invalid program'],
    [ProblemResultStatus.Timeout, 'Execution timeout']
  ])

  getResultStatusDescription(status: ProblemResultStatus): string {
    return this.problemResultStatusTextMap.get(status) ?? 'Server error'
  }

  get modalProblemResult(): VueFire<ProblemResult> | undefined {
    if (this.modalIndex === null) return
    if (this.problemResults.length === 0) return
    return this.problemResults[this.modalIndex]
  }

  get modalTestResults(): TestResult[] | undefined {
    return this.modalProblemResult?.testResults
  }

  @Watch('modalIndex')
  onModalIndexChange(value: string, _oldValue: string): void {
    if (value === null) return

    this.$nextTick(() => {
      const modal = this.$refs.problemResultModal as Vue | undefined
      if (modal) (modal.$el as HTMLElement).focus()
    })
  }

  incrementModal(): void {
    if (this.modalIndex === null) return
    const maxIndex = this.problemResults.length - 1
    if (maxIndex < 0) return

    this.modalIndex = this.modalIndex >= maxIndex ? 0 : this.modalIndex + 1
  }

  decrementModal(): void {
    if (this.modalIndex === null) return
    const maxIndex = this.problemResults.length - 1
    if (maxIndex < 0) return

    this.modalIndex = this.modalIndex <= 0 ? maxIndex : this.modalIndex - 1
  }

  getDownloadableUrl(gsUrl: string): string {
    const pathWithoutProtocol = gsUrl.replace(/^(\w+:)\/\//, '')
    return `https://storage.googleapis.com/${pathWithoutProtocol}`
  }

  getFileName(gsUrl: string): string {
    return gsUrl.slice(Math.max(0, gsUrl.lastIndexOf('/') + 1))
  }

  private readonly congratulationMessages = [
    'Congratulations',
    'Couldn’t have done it better myself',
    'Exactly right!',
    'Excellent!',
    'Fantastic!',
    'Good for you!',
    'Good job',
    'Good thinking',
    'Good work',
    'Great!',
    'I knew you could do it!',
    'I think you’ve got it now',
    'I’m proud of the way you worked today',
    'I’m very proud of you',
    'I’ve never seen anyone do it better',
    'Keep it up!',
    'Keep up the good work',
    'Marvelous',
    'Nice going',
    'Nothing can stop you now',
    'Now you’ve got it figured out',
    'Now you’ve got the hang of it',
    'Outstanding!',
    'Perfect!',
    'Right on!',
    'Sensational!',
    'Super!',
    'Superb',
    'Terrific',
    'That kind of work makes me very happy.',
    'That’s RIGHT!',
    'That’s better',
    'That’s good',
    'That’s great!',
    'That’s it!',
    'That’s not bad!',
    'That’s really nice',
    'That’s the best ever',
    'That’s the right way to do it',
    'That’s the way to do it!',
    'That’s what I call a fine job!',
    'Tremendous!',
    'WOW!',
    'Way to go!',
    'Well, look at you go!',
    'Wonderful!',
    'You are really learning a lot',
    'You are very good at that.',
    'You certainly did well today',
    'You did that very well',
    'You figured that out fast',
    'You make it look easy',
    'You must have been practicing!',
    'You outdid yourself today',
    'You really are going to town',
    'You’re doing a good job',
    'You’re doing beautifully',
    'You’re getting better every day',
    'You’re learning fast',
    'You’re on the right track now!',
    'You’re really improving',
    'You’re really working hard today',
    'You’ve got your brain in gear today',
    'You’ve just mastered that!'
  ]

  private readonly congratulationFaces = [
    '(* >ω<)b',
    'ヽ(´▽`)/',
    'ヽ(´ー｀)ノ',
    'ᕙ(⇀‸↼‶)ᕗ',
    'ᕕ( ᐛ )ᕗ',
    '┌(ㆆ㉨ㆆ)ʃ',
    '(◠﹏◠)',
    '~(^-^)~'
  ]

  getRandomCongratsMessage(): string {
    return randomElement(this.congratulationMessages)
  }

  getRandomCongratsEmoji(): string {
    return randomElement(this.congratulationFaces)
  }

  async confirm(): Promise<void> {
    if (!this.course || !this.problem || !this.selectedLanguageId) {
      this.$buefy.toast.open('Something went wrong: please refresh the page')
      return
    }

    this.uploading = true
    try {
      await this.$storageDao.createSubmission(this.course.id, this.activity.id, this.problem.id, this.user.id, this.dropFiles, this.selectedLanguageId)
      this.dropFiles = []
      this.uploading = false
    } catch (error) {
      if (error instanceof Error) this.$buefy.toast.open(`Something went wrong: ${error.message}`)
    }
  }

  get languages(): Array<VueFire<ConfigLanguage>> {
    const courseLanguages = this.course?.allowedLanguages ?? []
    return (courseLanguages.length === 0)
      ? this.$store.getters.allLanguages
      : this.$store.getters.allLanguages.filter((language: VueFire<ConfigLanguage>) => courseLanguages.includes(language.id))
  }

  // TODO: Extract
  private readonly extToLang: Record<string, string> = {
    dart: 'dart',
    go: 'go',
    java: 'java',
    js: 'javascript',
    kt: 'kotlin',
    php: 'php',
    py: 'python',
    scala: 'scala',
    swift: 'swift',
    ts: 'typescript'
  }

  @Watch('dropFiles')
  dropFilesChanged(): void {
    if (this.dropFiles.length === 0) {
      this.selectedLanguageId = null
    } else if (this.selectedLanguageId === null) {
      const fileNameParts = this.dropFiles[0].name.split('.')
      const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase()
      const fileLanguage = this.extToLang[fileExtension]
      const language = this.languages.find(language => language.name.toLowerCase() === fileLanguage) ?? this.languages[0]
      this.selectedLanguageId = language.id
    }
  }

  deleteDropFile(index: number): void {
    this.dropFiles.splice(index, 1)
  }

  get themeCssClass(): string {
    return cssClass(this.course?.theme)
  }
}
