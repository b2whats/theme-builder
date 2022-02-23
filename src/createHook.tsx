import React, { useRef, useCallback, useReducer, useEffect, isValidElement } from 'react'
import type { ICellx } from 'cellx'
import type { Component, StyleSlots } from './Component'
import type { Properties } from './Properties'
import type { FunctionPartialAttr, Narrow } from './utils'
import type { Phase } from './useElementState'

type AsType = 
  | keyof JSX.IntrinsicElements
  | React.FunctionComponent<any>
  | React.ComponentClass<any>

type Join<L, R> = R & (L extends any ? Omit<L, keyof R> : never)
type BoxChildren = React.ReactChild | React.ReactChild[] | null | undefined

type BoxProps<As, Name, Element, ParentPhase, ChildrenComponent> = Join<(
  [Element] extends [React.FunctionComponent<infer FProps>] ? FProps & {} :
  [Element] extends [React.ComponentClass<infer CProps, any>] ? CProps & {} :
  Element extends React.DetailedHTMLProps<infer A, infer B> ? React.DetailedHTMLProps<A, B> :
  {}
), {
  as?: As,
  slot: Name,
  parentPhase?: ParentPhase,
  children?: ChildrenComponent extends undefined
      ? [ParentPhase] extends [never] ? BoxChildren : ((phase: Phase) => React.ReactChild) | BoxChildren
      : (themeChildren: ChildrenComponent) => [ParentPhase] extends [never] ? BoxChildren : ((phase: Phase) => React.ReactChild) | BoxChildren
}>

type BoxComponent<Slots> = {
  <
    Name extends keyof StyleSlots<Slots>,
    ChildrenComponent extends StyleSlots<Slots>[Name]['children'],
    As extends AsType = typeof defaultElement,
    Element = As extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[As] : As,
    ParentPhase extends ICellx<Phase, any> = never,
  >(props: BoxProps<As, Name, Element, ParentPhase, ChildrenComponent>): any
}
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

const theme = {}
const defaultElement = "div"

export function createHook<Props, Slots, PropertiesList extends Properties<any, any, any>>(component: Component<any, Props, Slots, PropertiesList>) {
  return (props: Props) => {
    const slots = useRef<StyleSlots<Slots>>()

    slots.current = component.execute(theme as any, props)

    const Box: BoxComponent<Slots> = useCallback(React.forwardRef(({ as, slot, parentPhase, children, ...props }, ref: React.Ref<Element>) => {
      const slotProps = slots.current![slot]
      
      if (typeof children === 'function' && slotProps.children) {
        children = children(slotProps.children) as any
      }

      if (typeof children === 'function' && parentPhase) {
        children = children(useCell(parentPhase)) as any
      }

      if (slotProps.childrenProps && isValidElement(children)) {
        children = <children.type {...slotProps.childrenProps} {...children.props}/> as any
      }
      
      return React.createElement(
        as || defaultElement,
        Object.assign(props, { ref, className: slotProps.className }),
        children
      )
    }), [])

    return Box
  }
}

const useCell = (value: ICellx) => {
  const forceUpdate = useReducer(() => ({}), {})[1]

  useEffect(() => {
    value.onChange(forceUpdate)
    return () => {
      value.offChange(forceUpdate)
    }
  }, [])

  return value()
}




type Xor<A, B> =
  | (A & { [k in keyof B]?: never })
  | (B & { [k in keyof A]?: never });
type Cond = {
  c?: string
}
type Props = {
  a?: 'a' | 'aa',
  b?: 'bb',
}
type Props1 = {
  b?: string
}

const A = (props: Props) => <div>1</div>
const B = (props: Props1) => <div>2</div>
const c = (props: Cond) => {
  if (props.c) return A
  else return B
}
type U = {
  component: (props: Props) => JSX.Element
  // a?: number
  // b?: number
}
type U1 = {
  component: (props: Props1) => (props: any) => void
  //a: string
  // c?: string
  // d?: string,
}
type OrFunction<Args, Return> = (props: Args) => Return
type AddPropertyFunction<L, Props> = L extends object ? {
  [K in keyof L]: L[K] | OrFunction<Props, L[K]>
} : never
type NoInfer<T> = T extends infer S ? S : never;
export type ComponentType<T = any, R = void> = (props: T) => R

type Combine<T, C> = {
  children: {
    component?: T //| ((props: any) => JSX.Element)
     // NoInfer<T> extends (props: any) => (props: any) => JSX.Element ? (props: C) => (props: {}) => JSX.Element : unknown)
    //T & (((props: C) => (props: any) => React.ReactChild) | ((props: any) => React.ReactChild)) //T | OrFunction<C, NoInfer<T>>
  } 
  // & (
  //   T extends (props: infer P) => infer R ? R extends ComponentType<infer PP> ?  AddPropertyFunction<PP, C> : AddPropertyFunction<P, C> : unknown
  // )

}
type UU<T> = number extends number ? ({
  component1?: T extends infer TT ? TT extends (props: any) => (props: any) => void ? (props: Cond) => (props: any) => void : 2 : never//(props: any) => JSX.Element
}) : never
type Combine2<T, C> = {
  children: {
    component: T & ((props: C, _: never) => (props: any) => JSX.Element)
  } | {
    component: T & ((props: any) => JSX.Element)
  }
}

type Combine3<C> = {
  component: ((props: C, _: never) => (props: any) => JSX.Element) //| ((props: any) => JSX.Element)
}

type CH<C> = {
  component: ((props: any, _: never) => (props: C) => JSX.Element)
}

type TRE = {
  component: ((props: Cond) => (props: any) => void)
} | {
  component: (props: any) => ((props: Props) => JSX.Element) | ((props: Props1) => JSX.Element);
}

type NoInfer1<T> = T & {[K in keyof T]: T[K]};
type NoInfer2<T> = [T][T extends any ? 0 : never];



function test<T extends (props: Cond) => ComponentType, U>(args: U & Combine<T, Cond> & Chil<T> ): T {
  return 1 as any
}

type Co<U> = U extends (props: any) => (props: any) => JSX.Element ? (props: Cond) => (props: any) => JSX.Element : (props: any) => JSX.Element
function test2<T, U extends { [K in keyof T]: (aa: Cond) => NonNullable<T[K]>  }>(args: Combine3<Cond> & CH<T> & U ): T {
  return 1 as any
}
type UUU<A1, A2> = number extends number ? (c: A2) => (p: A1) => 'aa' : never
type Chil<T> = T extends (a: infer C) => (aa: infer PP) => void ?  {
  a: UUU<C, PP>
  b?: (a: PP) => PP
} : {} 

test2({
  children: {
    component: (props, _) => {
      // if (props.c) return A
      // if (!props.c) return B
      return A
    },
    // component: (props, _) => { return A },
    // component: A,
    //akk: 'al',
    //a: 'a',
  },
  //a: 'add'



 // b: (a) => {}
})


function test3<B, T extends { [K in keyof B]: (aa: Cond) => B[K]  }>(oo: B, o: T) {}

test3({
  a: '2' as '2' | '3' | '4'
},{
  a: (c) => '3'
})

type Test = {
  a?: 'a' | 'aa'
  b?: 'b' | 'bb'
}

type Obj<C, P> = {
  component: ((props: C, _: never) => (props: P) => JSX.Element) //| ((props: any) => JSX.Element)
}
function test4<P,A extends { [K in keyof P]?: (params: Cond) => P[K]  }>(o: Obj<Cond, P> & A): P { return null as any }

test4({
  component: (props, _) => {
    // if (props.c) return A
    //if (!props.c) return B
    return A
  },
  a: (d) => 'aa'
})
type Obj5<C> = {
  component: ((props: C, _: never) => (props: any) => JSX.Element) //| ((props: any) => JSX.Element)
}
type Inf5<T> = {
  component: T
}
function test5<F>(o: Obj5<Cond> & Inf5<F> ): F { return null as any }

test5({
  component: (props, _) => {
    // if (props.c) return A
    //if (!props.c) return B
    return A
  },
  //a: 'aa'
  a: (d) => 'aa'
})

type Obj6<C> = {
  component: (<T extends any>(props: C, _: never) => (props: T) => JSX.Element) //| ((props: any) => JSX.Element)
}
type Inf6<T> = {
  component: T
}
type Inf66<U> = U extends <T extends infer UU>(props: any, _: never) => (props: T) => JSX.Element ? {q: 1} : unknown

function test6<F>(o: Obj5<Cond> & Inf6<F> ): Inf66<F> { return null as any }

test6({
  component: (props, _) => {
    // if (props.c) return A
    //if (!props.c) return B
    return A
  },
  //a: 'aa'
  //a: (d) => 'aa'
})

type Obj7<T> = {
  component: T
} & (
  // [T] extends [(props: any, _: never) => (props: infer P) => JSX.Element] 
  T extends (props: any, _: never) => (props: infer P) => JSX.Element
    ? { [K in keyof P]?: (params: Cond) => P[K] }
    // ? { [K in keyof P]?: (params: Cond) => NonNullable<P[K]> extends string ? NonNullable<P[K]> : never }
    : unknown
)

function test7<F extends (props: Cond, _: never) => (props: any) => JSX.Element>(o: Obj7<F> & {d?: (p: Cond) => 'a'} ): F { return null as any }

test7({
  component: (props, _) => {
    // if (props.c) return A
    //if (!props.c) return B
    return A
  },
  //a: [(p) => 'aa']
  a: (d) => 'aa',
  d: (d) => 'a',
})

type Obj8<T> = {
  component: T
} & (
  // [T] extends [(props: any, _: never) => (props: infer P) => JSX.Element] 
  T extends (props: infer P) => JSX.Element
    ? { [K in keyof P]?: (params: Cond) => P[K] }
    // ? { [K in keyof P]?: (params: Cond) => NonNullable<P[K]> extends string ? NonNullable<P[K]> : never }
    : unknown
)

function test8<F extends (props: any) => JSX.Element>(o: Obj8<F> & {d?: (p: Cond) => 'a'} ): F { return null as any }

test8({
  component: A,
  //a: [(p) => 'aa']
  a: (d) => 'aa',
  d: (d) => 'a',
})

type Obj9 = {
  component: (props: Cond, _: never) => (props: any) => JSX.Element
}

type Inf9<T> = T extends { component: infer C }
  ? { f?: [C] }
  : unknown

function test9<O>(o: Obj9 & O  & Inf9<O> ) { return null as any }

test9({
  component: (props, _) => { return A },
  //a: [(p) => 'aa']
  // a: (d) => 'aa',
  // d: (d) => 'a',
  f: (p, _) => (d) => null as any
})

type Obj10 = {
  component: (props: any) => JSX.Element
}

type Inf10<T> = T extends { component: infer C }
  ? { f?: C }
  : unknown

function test10<O extends Obj10>(o: O  & Inf10<O> ) { return null as any }

test10({
  component: A,
  //a: [(p) => 'aa']
  // a: (d) => 'aa',
  // d: (d) => 'a',
  f: (d) => null as any
})


type Obj11<T> = {
  component: T
} & (
  T extends (props: any) => JSX.Element ? { f?: T } : unknown
)

function test11<F>(o: Obj11<F> ) { return null as any }

test11({
  component: A,
  //a: [(p) => 'aa']
  // a: (d) => 'aa',
  // d: (d) => 'a',
  f: (d) => null as any
})

type Obj12<T> = {
  component: T
} & (
  T extends CurryComponent ? { f: NoInfer<T> } : unknown
)

function test12<F extends CurryComponent>(o: Obj12<F> ) { return null as any }

test12({
  component: (props: any) => { return A },
  //a: [(p) => 'aa']
  // a: (d) => 'aa',
  // d: (d) => 'a',
  f: (d) => (a) => null as any
})

type Obj13<T> = {
  component: CurryComponent & T
} & (
  T extends (props: any) => (props: infer P) => JSX.Element ? {
    [K in keyof P]: P[K] | ((p: Cond) => P[K])
  } : unknown
)

function test13<F>(o: Obj13<F> ) { return null as any }

test13({
  component: (props) => { return A }, // Работает если добавить тип :any
  //a: [(p) => 'aa']
  a: (d) => 'aa',
  // d: (d) => 'a',
})

type Obj14<T> = {
  component: T & CurryComponent
} & (
  ((f: T) => void) extends ((f: (props: Cond) => (props: infer P) => JSX.Element ) => void)? {
    [K in keyof P]: P[K] | ((p: Cond) => P[K])
  } : unknown
)

function test14<F>(o: Obj14<F> ) { return null as any }

test14({
  component: (props: any) => { return A }, // Работает если добавить тип :any
  //a: [(p) => 'aa']
  a: (d) => 'aa',
  // d: (d) => 'a',
})

type Obj15<T> = {
  component: CurryComponent<Cond, T>
} & (
  T extends infer P ?{
    [K in keyof P]: P[K] | ((p: Cond) => P[K])
  } : unknown
)


function test15<P>(o: Obj15<P> ) { return null as any }

test15({
  component: (props) => { return A }, // Работает если добавить тип :any
  //a: [(p) => 'aa']
  a: (d) => 'aa',
  // d: (d) => 'a',
})

type Obj16<T> = {
  component: T & CurryComponent<Cond>
}

type InferProps<F> = F extends CurryComponent<any, infer P>
  ? {
    readonly [K in keyof P]?: P[K] | ((p: Props) => P[K])
  } : unknown

function test16<F>(o: Obj16<F> & InferProps<F> ) { return null as any }

test16({
  component: (props) => { return A }, // Работает если добавить тип :any
  //a: [(p) => 'aa']
  a: (d) => 'aa',
  // d: (d) => 'a',
})

type Obj17 = {
  component: CurryComponent<Cond>
}

type InferComponent<F> = {
  component: CurryComponent<Cond, F>
} 

type InferProps1<P > = number extends number ?
  (([{
    [K in keyof P & string]-?: { k: K, p: Cond, v: P[K]  }
  }][P extends any ? 0 : never])): unknown

  type Te = { aa?: 'aa'} | { bb?: 'bb'}
function test17<F>(o: { children: Obj17 & InferComponent<F> & {
  t?: InferProps1<F> extends infer E ? { [K in keyof E]?: (c: E[K]['p']) => E[K]['v'] & unknown}  : unknown
}}) { return null as any }

test17({
  children: {
    component: (props) => { return A }, // Работает если добавить тип :any
    //a: [(p) => 'aa']
    // a: {
    //   p: { c: 'c' },
    //   v: 'aa'
    // },
    // d: (d) => 'a',
    t: {
      a: (a) => 'a'
    }
  },
})


type Obj18 = {
  component: CurryComponent<Cond>
}



function multiple<Con, Ret extends (p: any) =>  JSX.Element>(cb: (c: Con) => Ret): (c: Con) => Ret {
  return null as any
}

function test18<F>(o: Obj18 & { component: F, [key: string]: unknown } & InferProps<F> ) { return null as any }

test18({
  component: multiple((props: Cond) => A),
  //a: [(p) => 'aa']
  a: (d: any) => 'aa',
  // d: (d) => 'a',
})


type Obj19<P> = {
  readonly component?: CurryComponent<Cond, P>
}


type Covariance<T> = {
  readonly box: T
}
// extends { [K in keyof P]: (c: Cond) => P[K
function test19<P extends object>(o: Obj19<P> & { [K in keyof P]: <T extends P[K]>(c: Cond) => T & P[K] } ) { return null as any }

test19({
  component: (props) => A,
  //a: [(p) => 'aa']
  a: (d) => 'aa',
  // d: (d) => 'a',
})
export const _ = <T,>(): T => {
  throw new Error("hole"); 
}

type CurryComponent<C = Cond, P = any> = (cond: C) => (props: P) => JSX.Element
type SimpleComponent<P = any> = (props: P) => JSX.Element

type Obj20<P> =  number extends number ? {
  component?: CurryComponent<any, P> | SimpleComponent<P>
}
& (P extends object ? {
  [K in keyof P]?: (P[K] | ((c: Cond) => P[K]))
} : unknown)
: never



// extends { [K in keyof P]: (c: Cond) => P[K
function test20<P>(o:Obj20<P>) { return null as any }

test20({
  component: (c: Cond) => A,
  // component: A,
  //a: [(p) => 'aa']
  // a: _(),
  a: (c) => 'a',
  //d: (d) => 'a',
})

type Obj21<P> =  number extends number ? {
  component?: (c: Cond) => (p: P) => JSX.Element
  // a?: (c: Cond) => P extends Props ? P['a'] : 2
}
& (P extends Props ? {
  [K in keyof P ]?: P[K] | ((c: Cond) => P[K])
} : {
  [K in keyof P ]?: P[K] | ((c: Cond) => P[K])
})
: never

type Obj212<P> =  number extends number ? {
  component?: (p: P) => JSX.Element
  // a?: (c: Cond) => P extends Props ? P['a'] : 2
}
& (P extends Props ? {
  [K in keyof P ]?: P[K] | ((c: Cond) => P[K])
} : {
  [K in keyof P ]?: P[K] | ((c: Cond) => P[K])
})
: never

type Inf21<P> = (P extends object ? {
  [K in keyof P ]?: (c: Cond) => P[K]
} : unknown)

// extends { [K in keyof P]: (c: Cond) => P[K
function test21<P>(o: Obj21<P>) { return null as any }

test21({
  component: (props) => A,
  //a: [(p) => 'aa']
  // a: _(),
  a: (a) => 'a',
  //d: (d) => 'a',
})


type O =  ((props: any) => (props: any) => JSX.Element) extends ((props: any) => JSX.Element) ? 1 : 2
type R = Function



type O1 = {
  a: number
}
type O2 = {
  b: number
}

type I = O1 & O2

type ItoU<I> = I extends infer IO1  ? IO1: never

type TestItoU = ItoU<I>



type Json =
  | null
  | string
  | number
  | boolean
  | Array<JSON>
  | {
    [prop: string]: Json
  }

const foo = <
  Key extends PropertyKey,
  Value extends Json,
  T extends Record<Key, Value>[]
>(a: T) => a

// const foo: <PropertyKey, Json, { a: 42; b: "hello"; }
foo([{ a: 42, b: 'hello' }])



type Obj25<P> =  number extends number ? {
  component?: (g: P) => void 
}
: never



// extends { [K in keyof P]: (c: Cond) => P[K
function test25<P extends {}>(o:Obj25<P>) { return null as any }

type Inf<F> = F extends (a: infer A) => infer B ? [A, B] : never
type TES = Inf<(((a: 1) => 1) | ((a: 11) => 2))>
type EEE = (((a: 1) => 1) | ((a: 11) => 2)) extends ((a: infer A) => infer B) ? [A, B] : never
test25({
  component: ((c) => {}) as ((g: {a: 11}) => {} | ((gs: {b: 2}) => {}))

})

const aaa: {a?: number, b: string} | {b: number, c?: 3} = {
  a:11, b: 4, c: 3
}

type UnionOfFunctions = ((arg: {a: number} ) => any) | ((arg: {b: string}) => any)

// [number] | [string], which likely means UnionOfFunctions can be executed with number | string
type TypedWithParameters = Parameters<UnionOfFunctions>



type RR = {
  a: string,
  [key: `:${string}` | `&${string}`]: {
    aa: 1
  }
}

const RR: RR = {
  a: '',
  '&:ww': {
    aa: 1
  }
}