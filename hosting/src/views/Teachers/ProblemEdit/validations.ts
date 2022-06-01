import { DeepRequired } from 'ts-essentials'

import { Problem, Test, VueFire } from '@codee-club/common/dist/dao'
import { TestVisibility } from '@codee-club/common/dist/data-types/enums'
import { values } from '@codee-club/common/dist/utils/object-extensions'

const MINIMUM_TESTS = 5

export function hasValidNameDescription(formModel: VueFire<Problem>): boolean {
  return formModel.name.length >= 3 && formModel.description.length >= 3
}

function isValidTest(test: DeepRequired<Test>): boolean {
  return (test.input?.length ?? 0) > 0 || (test.expected?.length ?? 0) > 0
}

function isValidVisibleTest(test: DeepRequired<Test>): boolean {
  return test.visibility === TestVisibility.Visible && isValidTest(test)
}

export function hasMinimumTests(formModel: VueFire<Problem>): boolean {
  return values(formModel.tests).filter(test => isValidTest(test)).length >= MINIMUM_TESTS
}

export function hasMinimumVisibleTests(formModel: VueFire<Problem>): boolean {
  return values(formModel.tests).some(test => isValidVisibleTest(test))
}

export function hasVerifiedSolution(_formModel: VueFire<Problem>): boolean {
  return false
}
