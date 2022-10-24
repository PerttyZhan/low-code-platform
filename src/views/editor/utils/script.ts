const cache: Record<any, string> = {}

export const asyncScript = (url: string) => {
  if (cache[url]) return Promise.resolve(cache[url])
  return new Promise((resolve, reject) => {
    const lastWindowKey = Object.keys(window).pop()

    const script = document.createElement('script')
    script.setAttribute('src', url)
    document.head.appendChild(script)

    script.addEventListener('load', () => {
      // document.head.removeChild(script)
      const newLastWindowKey: string = Object.keys(window).pop() as string
      const library = lastWindowKey !== newLastWindowKey ? window[newLastWindowKey] : {}
      // const Com = library.default ? library.default: library
      cache[url] = library
      resolve(library)
    })
    script.addEventListener('error', error => reject(error))
  })
}

export const loadScript = async (url: string) => {
  const com = await asyncScript(url)
  return com
}

export const loadStyle = (url: string) => {
  return new Promise<void>((resolve, reject) => {
    let link = document.createElement("link")
    link.rel = "stylesheet"
    link.type = "text/css"
    link.href = url;
    document.head.appendChild(link)

    link.addEventListener('load', () => resolve())
    link.addEventListener('error', error => reject(error))
  })
}

export const importLibary = async ({
  js,
  css
}: any) => {
  return Promise.all([
    loadStyle(css),
    loadScript(js)
  ])
}