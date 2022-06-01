import { GuidGen } from '@codee-club/common/dist/utils/guids'

import admin from '~/firebase-admin-initialized'

export default GuidGen(admin.firestore())
