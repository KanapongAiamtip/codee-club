import QrCode from 'qrcode.vue'
import { DeepRequired } from 'ts-essentials'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { NavigationGuardNext, Route } from 'vue-router'

import { User, USERS, VueFire } from '@codee-club/common/dist/dao'
import { entries } from '@codee-club/common/dist/utils/object-extensions'

Component.registerHooks(['beforeRouteEnter', 'beforeRouteLeave', 'beforeRouteUpdate'])

@Component({
  metaInfo(this: Profile) {
    return this.profileUser
      ? {
          title: this.profileUser.name,
          meta: [
          // TODO: Not sure if this works without SSR
            { property: 'og:title', content: this.profileUser.name },
            { property: 'og:image', content: this.profileUser.avatarUrl }
          ]
        }
      : {}
  },
  components: { QrCode }
})
export default class Profile extends Vue {
  // Bound data
  profileUser: VueFire<User> | null = null
  followers: Array<VueFire<User>> = []
  following: Array<VueFire<User>> = []

  // Local data
  editableData: Pick<DeepRequired<User>, 'bio' | 'links'> | undefined = undefined
  editableAvatarFile: File | null = null

  // State
  profileLoading = true
  profileEditing = false
  profileUpdating = false
  followUpdating = false

  showModal = false

  async mounted(): Promise<void> { await this.load(this.$route.params.userId) }
  async beforeRouteUpdate(to: Route, _from: Route, next: NavigationGuardNext): Promise<void> { await this.load(to.params.userId); next() }

  async load(profileUserId: string): Promise<void> {
    this.profileLoading = true

    // Wipe editable data
    this.profileEditing = false
    this.editableAvatarFile = null

    // Load profile user, followers, following
    await this.$bind('profileUser', this.$db.collection(USERS).doc(profileUserId))
      .then(() => { this.profileLoading = false })
    await this.$bind('followers', this.$db.collection(USERS).where('followingIds', 'array-contains', profileUserId))
    await this.$bind('following', this.$db.collection(USERS).where('followerIds', 'array-contains', profileUserId))
  }

  get currentUserId(): string | undefined {
    return this.$store.state.currentUser?.id
  }

  get links(): Array<[string, string]> {
    return entries(this.profileUser?.links)
      .filter(link => link[1].length > 0)
      .sort((l1, l2) => l1[0].localeCompare(l2[0]))
  }

  get isMe(): boolean {
    return this.currentUserId !== undefined && this.profileUser?.id === this.currentUserId
  }

  get isFollowing(): boolean {
    return this.currentUserId !== undefined &&
      (this.profileUser?.followerIds?.includes(this.currentUserId) ?? false)
  }

  async follow(): Promise<void> {
    const profileUserId = this.profileUser?.id
    if (!profileUserId || !this.currentUserId) return

    this.followUpdating = true
    const follow = !this.isFollowing
    await this.$dao.followUser(this.currentUserId, profileUserId, follow)
    this.followUpdating = false
  }

  @Watch('editableAvatarFile')
  async saveAvatar(updatedValue: File | null, _oldValue: File | null): Promise<void> {
    if (!updatedValue || !this.currentUserId) return
    return await this.$storageDao.updateAvatar(this.currentUserId, updatedValue)
  }

  beginProfileEdit(): void {
    if (!this.profileUser) return

    const defaults = { bio: '', links: { github: '', linkedin: '', facebook: '' } }
    const { bio, links } = this.profileUser
    this.editableData = { ...defaults, bio, links: { ...links } }
    this.profileEditing = true
  }

  cancelProfileEdit(): void {
    this.profileEditing = false
  }

  async saveProfile(): Promise<void> {
    if (this.profileLoading || !this.currentUserId || !this.editableData) return

    this.profileEditing = false
    this.profileUpdating = true
    await this.$dao.updateUser(this.currentUserId, this.editableData)
      .then(() => { this.profileUpdating = false })
  }
}
