// TODO: This shouldn't be compiled into `common`
import { toHaveLengthLessOrEqual } from './to-have-length-inequality'
import { toIncludeAny } from './to-include-any'

expect.extend({
  toHaveLengthLessOrEqual,
  toIncludeAny
})
