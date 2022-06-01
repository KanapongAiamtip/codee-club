export enum TestVisibility { // TODO Chaz: If we need more than 2 states, we might consider using an int (so we can use inequality queries)
  Visible = 'VISIBLE',
  Hidden = 'HIDDEN'
}

export enum ActivityStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Locked = 'LOCKED'
}

export enum TestResultStatus {
  Pass = 'PASS',
  Fail = 'FAIL',
  Error = 'ERROR',
  Timeout = 'TIMEOUT'
}

export enum ProblemResultStatus {
  Evaluating = 'EVALUATING',
  Pass = 'PASS',
  Fail = 'FAIL',
  Invalid = 'INVALID',
  Timeout = 'TIMEOUT',
  Error = 'ERROR'
}
