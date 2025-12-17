import { getTextByPathList } from './utils'

export function getHorizontalAlign(node, pNode, type, warpObj) {
  let algn = getTextByPathList(node, ['a:pPr', 'attrs', 'algn'])
  if (!algn) algn = getTextByPathList(pNode, ['a:pPr', 'attrs', 'algn'])

  if (!algn) {
    if (type === 'title' || type === 'ctrTitle' || type === 'subTitle') {
      let lvlIdx = 1
      const lvlNode = getTextByPathList(pNode, ['a:pPr', 'attrs', 'lvl'])
      if (lvlNode) {
        lvlIdx = parseInt(lvlNode) + 1
      }
      const lvlStr = 'a:lvl' + lvlIdx + 'pPr'
      algn = getTextByPathList(warpObj, ['slideLayoutTables', 'typeTable', type, 'p:txBody', 'a:lstStyle', lvlStr, 'attrs', 'algn'])
      if (!algn) algn = getTextByPathList(warpObj, ['slideMasterTables', 'typeTable', type, 'p:txBody', 'a:lstStyle', lvlStr, 'attrs', 'algn'])
      if (!algn) algn = getTextByPathList(warpObj, ['slideMasterTextStyles', 'p:titleStyle', lvlStr, 'attrs', 'algn'])
      if (!algn && type === 'subTitle') {
        algn = getTextByPathList(warpObj, ['slideMasterTextStyles', 'p:bodyStyle', lvlStr, 'attrs', 'algn'])
      }
    } 
    else if (type === 'body') {
      algn = getTextByPathList(warpObj, ['slideMasterTextStyles', 'p:bodyStyle', 'a:lvl1pPr', 'attrs', 'algn'])
    } 
    else {
      algn = getTextByPathList(warpObj, ['slideMasterTables', 'typeTable', type, 'p:txBody', 'a:lstStyle', 'a:lvl1pPr', 'attrs', 'algn'])
    }
  }

  let align = 'left'
  if (algn) {
    switch (algn) {
      case 'l':
        align = 'left'
        break
      case 'r':
        align = 'right'
        break
      case 'ctr':
        align = 'center'
        break
      case 'just':
        align = 'justify'
        break
      case 'dist':
        align = 'justify'
        break
      default:
        align = 'inherit'
    }
  }
  return align
}

export function getVerticalAlign(node, slideLayoutSpNode, slideMasterSpNode) {
  let anchor = getTextByPathList(node, ['p:txBody', 'a:bodyPr', 'attrs', 'anchor'])
  if (!anchor) {
    anchor = getTextByPathList(slideLayoutSpNode, ['p:txBody', 'a:bodyPr', 'attrs', 'anchor'])
    if (!anchor) {
      anchor = getTextByPathList(slideMasterSpNode, ['p:txBody', 'a:bodyPr', 'attrs', 'anchor'])
      if (!anchor) anchor = 't'
    }
  }
  return (anchor === 'ctr') ? 'mid' : ((anchor === 'b') ? 'down' : 'up')
}

export function getTextAutoFit(node, slideLayoutSpNode, slideMasterSpNode) {
  const bodyPr = getTextByPathList(node, ['p:txBody', 'a:bodyPr'])
  let autoFitType = 'none'

  if (bodyPr) {
    if (bodyPr['a:spAutoFit']) autoFitType = 'shape'
    else if (bodyPr['a:normAutofit']) {
      autoFitType = 'text'
      const fontScale = getTextByPathList(bodyPr['a:normAutofit'], ['attrs', 'fontScale'])
      if (fontScale) {
        const scalePercent = parseInt(fontScale) / 1000
        return {
          type: 'text',
          fontScale: scalePercent,
        }
      }
    }
  }

  if (autoFitType === 'none' && slideLayoutSpNode) {
    const layoutBodyPr = getTextByPathList(slideLayoutSpNode, ['p:txBody', 'a:bodyPr'])
    if (layoutBodyPr) {
      if (layoutBodyPr['a:spAutoFit']) autoFitType = 'shape'
      else if (layoutBodyPr['a:normAutofit']) {
        autoFitType = 'text'
        const fontScale = getTextByPathList(layoutBodyPr['a:normAutofit'], ['attrs', 'fontScale'])
        if (fontScale) {
          const scalePercent = parseInt(fontScale) / 1000
          return {
            type: 'text',
            fontScale: scalePercent,
          }
        }
      }
    }
  }

  if (autoFitType === 'none' && slideMasterSpNode) {
    const masterBodyPr = getTextByPathList(slideMasterSpNode, ['p:txBody', 'a:bodyPr'])
    if (masterBodyPr) {
      if (masterBodyPr['a:spAutoFit']) autoFitType = 'shape'
      else if (masterBodyPr['a:normAutofit']) {
        autoFitType = 'text'
        const fontScale = getTextByPathList(masterBodyPr['a:normAutofit'], ['attrs', 'fontScale'])
        if (fontScale) {
          const scalePercent = parseInt(fontScale) / 1000
          return {
            type: 'text',
            fontScale: scalePercent,
          }
        }
      }
    }
  }

  return autoFitType === 'none' ? null : { type: autoFitType }
}