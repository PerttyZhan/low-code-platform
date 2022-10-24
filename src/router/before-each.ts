import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";
const MAX = 10

export default async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  next()
}