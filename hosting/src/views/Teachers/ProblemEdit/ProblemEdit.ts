import cloneDeep from 'lodash/cloneDeep'
import { DeepRequired } from 'ts-essentials'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { Problem, Test, VueFire } from '@codee-club/common/dist/dao'
import { TestVisibility } from '@codee-club/common/dist/data-types/enums'
import { keys, valuesWithIds } from '@codee-club/common/dist/utils/object-extensions'
import { FilterKeys } from '@codee-club/common/dist/utils/type-extensions'

import * as validations from './validations'

@Component({
  metaInfo(this: ProblemEdit) {
    return {}
  },
  methods: validations
})
export default class ProblemEdit extends Vue {
  @Prop() activityId!: string
  @Prop() problem!: VueFire<Problem> // TODO Easier to reuse if we only pass in problemId (see ActivityEdit)

  formModel: VueFire<Problem> = { id: '', name: '', description: '', tests: {}, seq: 0 }

  created(): void {
    this.formModel = cloneDeep(this.problem)
  }

  @Watch('problem')
  problemUpdated(): void {
    if (this.problem.id !== this.formModel.id) {
      this.formModel = cloneDeep(this.problem)
    }
  }

  get testsSorted(): Array<VueFire<Test>> {
    return valuesWithIds(this.formModel.tests).sort((a, b) => a.seq - b.seq)
  }

  async fieldChanged(field: FilterKeys<Problem, string>, event: Event): Promise<void> {
    const value = (event.target as HTMLInputElement).value
    await this.$dao.updateProblem(this.activityId, this.problem.id, { [field]: value })
  }

  async fieldInTestsChanged(testId: string, field: FilterKeys<Test, string>, event: Event): Promise<void> {
    const value = (event.target as HTMLInputElement).value
    await this.$dao.updateTest(this.activityId, this.problem.id, testId, { [field]: value })
  }

  async fieldInTestsAdded(field: FilterKeys<Test, string>, _event: Event): Promise<void> {
    const seq = this.testsSorted.length > 0 ? this.testsSorted[this.testsSorted.length - 1].seq + 1 : 1
    const data = { input: '', expected: '', visibility: TestVisibility.Hidden, seq }
    const id = await this.$dao.createTest(this.activityId, this.problem.id, data)
    this.$set(this.formModel.tests, id, data)

    this.$nextTick(() => {
      const bTable = this.$refs.tests as Vue
      const table = bTable.$el.firstElementChild?.firstElementChild as HTMLTableElement
      const lastRow = table.rows[table.rows.length - 2] // Get the last row not including footer
      const inputCell = lastRow.cells[field === 'expected' ? 2 : 1]
      const inputField = inputCell.firstElementChild?.firstElementChild as HTMLTextAreaElement
      inputField.focus()
    })
  }

  async switchInTestsChanged(testId: string | undefined, field: FilterKeys<Test, TestVisibility>, value: TestVisibility): Promise<void> {
    await (testId === undefined ? this.$dao.createTest(this.activityId, this.problem.id, { [field]: value }) : this.$dao.updateTest(this.activityId, this.problem.id, testId, { [field]: value }))
  }

  async deleteTest(id: string): Promise<void> {
    this.formModel.tests = keys(this.formModel.tests).reduce((result: { [x: string]: DeepRequired<Test> }, key) => { // eslint-disable-line unicorn/no-array-reduce -- TBD in separate branch
      if (key !== id) {
        result[key] = this.formModel.tests[key]
      }
      return result
    }, {})
    await this.$dao.deleteTest(this.activityId, this.problem.id, id)
  }

  async swapTest(seqX: number, seqY: number): Promise<void> {
    const idX = keys(this.formModel.tests).find(testId => this.formModel.tests[testId].seq === seqX)
    const idY = keys(this.formModel.tests).find(testId => this.formModel.tests[testId].seq === seqY)

    if (idX === undefined || idY === undefined) {
      return
    }
    this.formModel.tests[idX].seq = seqY
    this.formModel.tests[idY].seq = seqX
    await this.$dao.updateTest(this.activityId, this.problem.id, idX, { seq: seqY })
    await this.$dao.updateTest(this.activityId, this.problem.id, idY, { seq: seqX })
  }
}
