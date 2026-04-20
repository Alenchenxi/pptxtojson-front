import * as txml from 'txml/dist/txml.mjs'

let cust_attr_order = 0

// 优化：XML 文件缓存，避免重复读取
const xmlCache = new Map()

export function simplifyLostLess(children, parentAttributes = {}) {
  const out = {}
  if (!children.length) return out

  if (children.length === 1 && typeof children[0] === 'string') {
    return Object.keys(parentAttributes).length
      ? {
          attrs: { order: cust_attr_order++, ...parentAttributes },
          value: children[0],
        }
      : children[0]
  }
  for (const child of children) {
    if (typeof child !== 'object') return
    if (child.tagName === '?xml') continue

    if (!out[child.tagName]) out[child.tagName] = []

    const kids = simplifyLostLess(child.children || [], child.attributes)

    if (typeof kids === 'object') {
      if (!kids.attrs) kids.attrs = { order: cust_attr_order++ }
      else kids.attrs.order = cust_attr_order++
    }
    if (Object.keys(child.attributes || {}).length) {
      kids.attrs = { ...kids.attrs, ...child.attributes }
    }
    out[child.tagName].push(kids)
  }
  for (const child in out) {
    if (out[child].length === 1) out[child] = out[child][0]
  }

  return out
}

function advancedTagNameCleaner(data, seen = new WeakMap()) {
  // 防止循环引用
  if (seen.has(data)) {
    return data
  }
  if (data && typeof data === 'object') {
    seen.set(data, true)
  }

  // 处理当前节点的tagName
  if (data && typeof data === 'object') {
    if (data.tagName && typeof data.tagName === 'string') {
      if (!data.tagName.startsWith('p:')) {
        data.tagName = 'p:' + data.tagName
      }
    }

    // 递归处理所有子节点和嵌套属性
    Reflect.ownKeys(data).forEach((key) => {
      if (data[key] && typeof data[key] === 'object') {
        advancedTagNameCleaner(data[key], seen)
      }
    })
  }

  return data
}

export async function readXmlFile(zip, filename, cleanTagName = false) {
  // 优化：检查缓存
  const cacheKey = `${filename}_${cleanTagName ? '1' : '0'}`
  if (xmlCache.has(cacheKey)) {
    
    // 浅拷贝返回，避免直接修改缓存对象
    const cached = xmlCache.get(cacheKey)
    
    return cached && typeof cached === 'object' ? { ...cached } : cached
  }

  try {
    const data = await zip.file(filename).async('string')
    const txmlData = txml.parse(data)
    let result
    
    if (txmlData.length === 2 && cleanTagName) {
      advancedTagNameCleaner(txmlData[1])
    } 
    result = simplifyLostLess(txmlData)
    
    // 优化：深拷贝后缓存，确保缓存数据不可变
    const immutableResult = deepClone(result)
    
    xmlCache.set(cacheKey, immutableResult)
    return result
  } catch {
    return null
  }
}

// 深拷贝函数，用于缓存数据
function deepClone(obj, hash = new WeakMap()) {
  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj)
  }
  
  // 处理原始类型和特殊对象
  if (Object(obj) !== obj) return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  
  // 创建新对象
  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj))
  hash.set(obj, clone)
  
  // 递归拷贝所有属性
  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], hash)
  }
  
  return clone
}

// 清除缓存的函数
export function clearXmlCache() {
  xmlCache.clear()
}
