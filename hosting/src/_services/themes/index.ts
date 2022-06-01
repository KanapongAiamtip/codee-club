import { keys } from '@codee-club/common/dist/utils/object-extensions'

const themes: { [theme: string]: { icon: string } } = {
  default: {
    // eslint-disable-next-line radar/no-duplicate-string
    icon: 'code-braces'
  },
  java: {
    icon: 'language-java'
  },
  kotlin: {
    icon: 'language-kotlin'
  },
  swift: {
    icon: 'language-swift'
  },
  python: {
    icon: 'language-python'
  },
  green: {
    icon: 'tree-outline'
  },
  pink: {
    icon: 'heart'
  },
  orange: {
    icon: 'star'
  },
  go: {
    icon: 'language-ruby'
  }
}

export const cssClass = function (theme?: string): string {
  return theme && keys(themes).includes(theme) ? `is-theme-${theme}` : 'is-theme-default'
}

export const iconName = function (theme?: string): string {
  if (theme && keys(themes).includes(theme)) {
    return themes[theme].icon
  }
  return themes.default.icon
}
