
export interface Offset {
  x: number,
  y: number
}

export type DivElement = HTMLDivElement | null

export const elementOffset = (ele: DivElement): Offset => {
  let nowEle: DivElement | null = ele
  let offset = {
    x: 0,
    y: 0
  }
  while (nowEle) {
    offset.x = offset.x + nowEle.offsetLeft
    offset.y = offset.y + nowEle.offsetTop
    nowEle = nowEle.parentElement as DivElement
  }

  return offset
}

type numStr = number | string

export const boundCoord = (
  startX: numStr = 0,
  startY: numStr = 0,
  width: numStr = 0,
  height: numStr = 0
): any => {
  const x1 = Number(startX)
  const y1 = Number(startY)

  return {
    x: x1,
    y: y1,
    x1: x1 + Number(width) / 2,
    y1: y1 + Number(height) / 2,
    x2: x1 + Number(width),
    y2: y1 + Number(height),
  }
}

export const getElementType = (ele: Element) => {
  return ele.tagName.toLocaleLowerCase()
}