import { CodeeContext } from '@codee-club/common/dist/context'

import { auth, db, FieldValue } from '~/firebase-admin-initialized'

export const context = new CodeeContext(auth, db, FieldValue)
