import { New, User } from '@codee-club/common/dist/dao'

import getGuid from '~/get-guid'

const IDS = {
  phuwin: 'phuwin',
  pond: 'pond',
  book: 'book',
  force: 'force',
  sea: 'sea',
  jimmy: 'jimmy',
  inpitar: 'inpitar',
  bever: 'bever',
  pet: 'pet',
  card: 'card',
  khet: 'khet',
  charb: 'charb'

}

const teachers: Array<New<User> & { id: string, email: string }> = [
  { id: IDS.phuwin, email: 'phuwin@gmail.com', nameFirst: 'Phuwin', nameLast: 'Tangsakyuen', avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/codee-club-emu.appspot.com/o/profiles%2Favatars%2Fphuwin.jpg?alt=media&token=11fb44bd-7b5f-4c0e-8424-29d2e935b1dc', bio: 'God of IT  Dev Team Codee', links: { github: '', linkedin: '' }, followingIds: [IDS.pond, IDS.book], followerIds: [IDS.pond, IDS.book, IDS.force, IDS.sea, IDS.jimmy, IDS.inpitar, IDS.bever], roles: ['contributor', 'creator'] },
  { id: IDS.pond, email: 'pond@gmail.com', nameFirst: 'Naravit', nameLast: 'Lertratkosum', avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/codee-club-emu.appspot.com/o/profiles%2Favatars%2Fpond.jpg?alt=media&token=8d8438b9-9d0e-4a79-a429-ff333a25662a', bio: 'Fish up porn the sky', followingIds: [IDS.phuwin, IDS.book], followerIds: [IDS.phuwin], roles: ['contributor', 'creator'] },
  { id: getGuid(), email: 'jaratsrir@nu.ac.th', nameFirst: 'Jaratsri', nameLast: 'Rungratanaubol' },
  { id: getGuid(), email: 'wuttipongr@nu.ac.th', nameFirst: 'Wuttipong', nameLast: 'Ruanthong' },
  { id: getGuid(), email: 'nattaponk@nu.ac.th', nameFirst: 'Nattapon', nameLast: 'Kumyaito' }
]

const students: Array<New<User> & { id: string, email: string, sectionCode: string }> = [
  { id: IDS.book, email: 'book@codee.club', sectionCode: '1', nameFirst: 'Kasidet', nameLast: 'Plookphol', code: '62310404', avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/codee-club-emu.appspot.com/o/profiles%2Favatars%2Fbookk.jpg?alt=media&token=c15fdb04-9e8c-4476-9f2d-e621fca43052', bio: '', links: { github: '' }, followingIds: [IDS.phuwin, IDS.force], followerIds: [IDS.phuwin, IDS.pond, IDS.force, IDS.jimmy, IDS.sea, IDS.inpitar, IDS.bever] },
  { id: IDS.force, email: 'force@codee.club', sectionCode: '2', nameFirst: 'Jiratchapong', nameLast: 'Srisang', code: '62310434', avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/codee-club-emu.appspot.com/o/profiles%2Favatars%2Fforce.jpg?alt=media&token=8b429312-8631-44ff-bb3d-d6302d0e4bdb', bio: '', followingIds: [IDS.phuwin, IDS.book], followerIds: [IDS.book] },
  { id: IDS.sea, email: 'sea@nu.ac.th', sectionCode: '3', nameFirst: ' Tawinan', nameLast: 'Anukoolprasert', code: '62313016', avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/codee-club-emu.appspot.com/o/profiles%2Favatars%2Fsea.jpg?alt=media&token=7a20da52-9b7d-4e2a-8c48-4dd17cf129ea', followingIds: [IDS.phuwin, IDS.book], followerIds: [], roles: ['contributor'] },
  { id: IDS.jimmy, email: 'jimmy@nu.ac.th', sectionCode: '4', nameFirst: 'Jitaphon', nameLast: 'Potiwihok', code: '62315935', avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/codee-club-emu.appspot.com/o/profiles%2Favatars%2Fjimmy.jpg?alt=media&token=de4e3d14-c3ab-4552-8ece-c64f6afb5f10', followingIds: [IDS.phuwin, IDS.book], followerIds: [IDS.force], roles: ['contributor'] },
  { id: IDS.inpitar, email: 'in@nu.ac.th', sectionCode: '5', nameFirst: 'Sarin', nameLast: 'Ronnakiat', code: '63314975', avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/codee-club-emu.appspot.com/o/profiles%2Favatars%2Fin.jpg?alt=media&token=743a92a8-63ec-4b78-86dd-3a508846cf3e', followingIds: [IDS.phuwin, IDS.book, IDS.bever], followerIds: [IDS.bever], roles: ['contributor'] },
  { id: IDS.bever, email: 'bever@nu.ac.th', sectionCode: '6', nameFirst: 'Patsapon', nameLast: 'Patsapon Jansuppakitkun,', code: '63315125', avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/codee-club-emu.appspot.com/o/profiles%2Favatars%2Fbbever.jpg?alt=media&token=a03b5896-b693-4670-b3b1-9345614ffdcf', followingIds: [IDS.phuwin, IDS.book, IDS.inpitar], followerIds: [IDS.inpitar], roles: ['contributor'] },
  { id: IDS.pet, email: 'vachirapont63@nu.ac.th', sectionCode: '1', nameFirst: 'Vachirapon', nameLast: 'Tosawat', code: '63313909', avatarUrl: '', roles: [] },
  { id: IDS.card, email: 'panuphuni63@nu.ac.th', sectionCode: '1', nameFirst: 'Panuphun', nameLast: 'Injan', code: '63313572', avatarUrl: '', roles: [] },
  { id: IDS.khet, email: 'piyachoks63@nu.ac.th', sectionCode: '1', nameFirst: 'Piyachok', nameLast: 'Seangbuddeen', code: '63312995', avatarUrl: '', roles: [] },
  { id: IDS.charb, email: 'nanthaphongk63@nu.ac.th', sectionCode: '1', nameFirst: 'Nanthaphong', nameLast: 'Khongyut', code: '63312346', avatarUrl: '', roles: [] }

]

const testStudentEmails = new Set([
  'book@codee.club',
  'force@codee.club',
  'sea@nu.ac.th',
  'jimmy@nu.ac.th',
  'in@nu.ac.th',
  'bever@nu.ac.th',
  'nanthaphongk63@nu.ac.th',
  'vachirapont63@nu.ac.th',
  'piyachoks63@nu.ac.th',
  'panuphuni63@nu.ac.th'

])

export const keyedTeachers: Array<{ id: string, email: string, data: New<User> }> = teachers.map(({ id, email, ...data }) => ({ id, email, data }))
export const keyedStudents: Array<{ id: string, data: New<User>, email: string, sectionCode: string }> = students.map(({ id, email, sectionCode, ...data }) => ({ id, email, sectionCode, data }))
export const keyedTestStudents = keyedStudents.filter(s => testStudentEmails.has(s.email))
