import Vue from 'vue'
import Meta from 'vue-meta'
import Router, { RouteConfig } from 'vue-router'
import multiguard from 'vue-router-multiguard'

import * as Pages from '@/views'

import requireLogin from './guard-require-login'
import Routes from './routes'

Vue.use(Router)
Vue.use(Meta)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: Routes.MainHome,
    component: Pages.MainHome
  },
  {
    path: '/profiles/:userId',
    name: Routes.UserProfile,
    component: Pages.UsersProfile
  },
  {
    path: '/login',
    name: Routes.UserLogin,
    component: Pages.UsersLogin,
    beforeEnter: async (_to, _from, next) => {
      if (!process.env.VUE_APP_EMU_PORT_AUTH) return next({ name: Routes.MainHome }) // prevent direct navigation to dev login page
      return next()
    }
  },
  {
    path: '/auth/nu-connect-callback',
    name: Routes.UserLoginCallback,
    component: Pages.UsersLoginCallback
  },
  {
    path: '/about',
    name: Routes.MainAbout,
    component: Pages.MainAbout
  },
  {
    path: '/release-notes',
    name: Routes.MainReleaseNotes,
    component: Pages.MainReleaseNotes
  },
  {
    // Ex: /231374-19s1
    path: '/:courseSlug',
    name: Routes.StudentCourseView,
    component: Pages.StudentsCourseView,
    beforeEnter: multiguard([requireLogin])
  },
  {
    // Ex: /new-course/edit
    path: '/:courseSlug/edit',
    name: Routes.TeacherCourseEdit,
    component: Pages.TeachersCourseEdit
  },
  // {
  //   // Ex: /231374-19s1/section-A
  //   path: '/:courseSlug/section-:sectionId',
  //   name: Routes.???,
  //   component: Pages.Debug
  // },
  {
    // Ex: /231374-19s1/G1-Introduction-to-Scala
    path: '/:courseSlug/:activitySlug', // TODO: Ban activity slugs starting with `section-`
    name: Routes.StudentActivityView,
    component: Pages.StudentsActivityView,
    beforeEnter: multiguard([requireLogin])
  },
  {
    // Ex: /231374-19s1/new-activity/edit
    path: '/:courseSlug/:activitySlug/edit',
    name: Routes.TeacherActivityEdit,
    component: Pages.TeachersActivityEdit,
    beforeEnter: multiguard([requireLogin])
  },
  {
    // Ex: /231374-19s1/G1-Introduction-to-Scala/progress
    path: '/:courseSlug/:activitySlug/progress',
    name: Routes.TeacherProgress,
    component: Pages.TeachersActivityProgress,
    beforeEnter: multiguard([requireLogin])
  },
  {
    // Ex: /231374-19s1/G1-Introduction-to-Scala/1
    path: '/:courseSlug/:activitySlug/:problemSeq(\\d+)',
    name: Routes.StudentProblemView,
    component: Pages.StudentsProblemView,
    beforeEnter: multiguard([requireLogin])
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'is-active',
  routes
})

export default router
