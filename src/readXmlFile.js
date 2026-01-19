import * as txml from 'txml/dist/txml.mjs'

let cust_attr_order = 0

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
  try {
    const data = await zip.file(filename).async('string')
    const txmlData = txml.parse(data)
    if (txmlData.length === 2 && cleanTagName) {
      advancedTagNameCleaner(txmlData[1])
    }
    return simplifyLostLess(txmlData)
  } catch {
    return null
  }
}
