declare module 'd3-tip' {
  import { Selection } from 'd3-selection'

  interface D3Tip {
    (): D3Tip
    attr(name: string): string
    attr(name: string, value: string | number | boolean): D3Tip
    style(name: string): string
    style(name: string, value: string | number | boolean, priority?: string): D3Tip
    offset(): [number, number]
    offset(tuple: [number, number]): D3Tip
    html(): (d: any) => string
    html(func: (d: any) => string): D3Tip
    direction(): (d: any) => string
    direction(func: (d: any) => string): D3Tip
    show(): D3Tip
    show(target: any, d?: any): D3Tip
    hide(): D3Tip
    hide(target?: any): D3Tip
    destroy(): D3Tip
  }

  const d3Tip: () => D3Tip
  export default d3Tip
}

