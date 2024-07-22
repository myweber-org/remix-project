import React, {useState, useEffect, useContext, useRef, ReactNode} from 'react' // eslint-disable-line

import './remix-ui-grid-section.css'
import FiltersContext from "./filtersContext"

declare global {
  interface Window {
    _paq: any
  }
}
const _paq = window._paq = window._paq || []

interface RemixUIGridSectionProps {
  plugin: any
  title?: string
  hScrollable: boolean
  classList?: string
  styleList?: any
  children?: ReactNode
  expandedCell?: any
}

const hasChildCell = (children: ReactNode): boolean => {
  return true
  let found = false

  const isElement = (child: ReactNode): child is React.ReactElement => {
    return React.isValidElement(child)
  }

  const traverse = (child: ReactNode) => {
    console.log('found ', children)

    if (found) return

    if (isElement(child)) {
      if (child.props.classList === 'EECellStyle') {
        found = true
        console.log('found ', child.props.className)
        return
      }

      if (child.props.children) {
        React.Children.forEach(child.props.children, traverse)
      }
    }
  }

  React.Children.forEach(children, traverse)
  return found
}

export const RemixUIGridSection = (props: RemixUIGridSectionProps) => {
  const [children, setChildren] = useState(props.children)
  const filterCon = useContext(FiltersContext)

  useEffect(() => {
    setChildren(props.children)
  }, [props.children])

  return (
    <div
      className={`d-flex px-4 py-2 flex-column w-100 remixui_grid_section_container ${props.classList}`}
      data-id={"remixUIGS" + props.title}
      style={{ overflowX: 'auto' }}
    >
      <div className="d-flex flex-column w-100 remixui_grid_section">
        { props.title && <h6 className='mt-1 mb-0 align-items-left '>{ props.title }</h6> }
        <div className={(props.hScrollable) ? `d-flex flex-row pb-2  overflow-auto` : `d-flex flex-wrap`}>
          { !hasChildCell(children) && <span> No items found </span>}
          { props.children }
        </div>
        { props.expandedCell && <div>
          { props.expandedCell }
        </div>
        }
      </div>
    </div>
  )
}

export default RemixUIGridSection
