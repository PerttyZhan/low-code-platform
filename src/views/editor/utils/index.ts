
export const typeString = (target: any):string => Object.prototype.toString.call(target).slice(8, -1).toLocaleLowerCase()