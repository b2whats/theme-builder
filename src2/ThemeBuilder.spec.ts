import type { StyleProperties } from './StyleProperties'
import { ThemeBuilder, utils, mergeStyles, ComponentTheme, Slot } from './ThemeBuilder'

interface ButtonProps {
  children?: any
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
  size?: 's' | 'm' | 'l'
  kind?: 'fill' | 'outline' | 'flat',
  p?: number,
  mapProps1?: string,
  mapProps2?: string,
}

interface TextProps extends StyleProperties {
  fontSize?: number
  lineHeight?: number | 'none' | 'inherit'
  dense?: boolean
}

type ButtonTheme = ComponentTheme<ButtonProps, {
  Button: Slot,
  Text: Slot<TextProps>,
}>
  

test('defaultProps = undefined', () => {
  const ButtonTheme = new ThemeBuilder<ButtonTheme>()
    .defaultProps(undefined)

  expect(ButtonTheme).toMatchSnapshot()
})

test('defaultProps = { size: s }', () => {
  const ButtonTheme = new ThemeBuilder<ButtonTheme>()
    .defaultProps({
      size: 's'
    })

  expect(ButtonTheme).toMatchSnapshot()
})

test('mapProps = () => ({})', () => {
  const ButtonTheme = new ThemeBuilder<ButtonTheme>()
    .mapProps(() => ({}))

  expect(ButtonTheme).toMatchSnapshot()
})

test('slot Button is tag (default type)', () => {
  const ButtonTheme = new ThemeBuilder<ButtonTheme>()
    .slot('Button', {
      fontSize: 12
    }, 'div')

  expect(ButtonTheme).toMatchSnapshot()
})

test('slot Text is component', () => {
  const ButtonTheme = new ThemeBuilder<ButtonTheme>()
    .slot('Text', {
      fontSize: 12
    })

  expect(ButtonTheme).toMatchSnapshot()
})

test('slot Button as object styles', () => {
  const ButtonTheme = new ThemeBuilder<ButtonTheme>()
    .slot('Button', {
      fontSize: 12,
      color: () => 'red300',
    }, 'div')

  expect(ButtonTheme).toMatchSnapshot()
})

test('slot Button as array styles', () => {
  const ButtonTheme = new ThemeBuilder<ButtonTheme>()
    .slot('Button', [
      {
        fontSize: 12
      }
    ], 'div')

  expect(ButtonTheme).toMatchSnapshot()
})

test('slot Button as array styles with any elements', () => {
  const ButtonTheme = new ThemeBuilder<ButtonTheme>()
    .slot('Button', [
      '',
      {
        fontSize: 12
      },
      utils.css`
        color: red;
      `
    ], 'div')

  expect(ButtonTheme).toMatchSnapshot()
})

test('merge two theme - defaultProps empty/empty', () => {
  const ButtonTheme1 = new ThemeBuilder<ButtonTheme>()
    .defaultProps(undefined)

  const ButtonTheme2 = new ThemeBuilder<ButtonTheme>()
    .defaultProps(undefined)

  const ButtonTheme3 = ButtonTheme1.merge(ButtonTheme2)
  expect(ButtonTheme3).toMatchSnapshot()
})

test('merge two theme - defaultProps empty/not empty', () => {
  const ButtonTheme1 = new ThemeBuilder<ButtonTheme>()
    .defaultProps(undefined)

  const ButtonTheme2 = new ThemeBuilder<ButtonTheme>()
    .defaultProps({
      size: 's'
    })

  const ButtonTheme3 = ButtonTheme1.merge(ButtonTheme2)
  expect(ButtonTheme3).toMatchSnapshot()
})

test('merge two theme - defaultProps additional props', () => {
  const ButtonTheme1 = new ThemeBuilder<ButtonTheme>()
    .defaultProps({
      size: 's'
    })

  const ButtonTheme2 = new ThemeBuilder<ButtonTheme>()
    .defaultProps({
      kind: 'flat'
    })

  const ButtonTheme3 = ButtonTheme1.merge(ButtonTheme2)
  expect(ButtonTheme3).toMatchSnapshot()
})

test('merge two theme - defaultProps override props', () => {
  const ButtonTheme1 = new ThemeBuilder<ButtonTheme>()
    .defaultProps({
      size: 's'
    })

  const ButtonTheme2 = new ThemeBuilder<ButtonTheme>()
    .defaultProps({
      size: 'l'
    })

  const ButtonTheme3 = ButtonTheme1.merge(ButtonTheme2)
  expect(ButtonTheme3).toMatchSnapshot()
})

test('merge two theme - mapProps empty/not empty', () => {
  const ButtonTheme1 = new ThemeBuilder<ButtonTheme>()

  const mapProps2 = jest.fn()
  const ButtonTheme2 = new ThemeBuilder<ButtonTheme>()
    .mapProps(mapProps2)

  const ButtonTheme3 = ButtonTheme1.merge(ButtonTheme2)

  const props: ButtonProps = {
    kind: 'flat'
  }
  ButtonTheme3.theme.mapProps!(props)

  expect(mapProps2).toHaveBeenCalledWith(props);
  expect(ButtonTheme3).toMatchSnapshot()
})

test('merge two theme - mapProps not empty/not empty', () => {
  const mapProps1 = jest.fn(({ kind }) => ({ mapProps1: kind }))
  const ButtonTheme1 = new ThemeBuilder<ButtonTheme>()
    .mapProps(mapProps1)
  const mapProps2 = jest.fn(({ kind }) => ({ kind, mapProps2: kind }))
  const ButtonTheme2 = new ThemeBuilder<ButtonTheme>()
    .mapProps(mapProps2)

  const ButtonTheme3 = ButtonTheme1.merge(ButtonTheme2)

  const props: ButtonProps = {
    kind: 'flat'
  }

  const mapProps3 = ButtonTheme3.theme.mapProps!(props)
  expect(mapProps1).toHaveBeenCalledWith(props);
  expect(mapProps2).toHaveBeenCalledWith(props);

  expect(mapProps3).toMatchSnapshot()
})

test('merge two theme - cache 2', () => {
  const ButtonTheme1 = new ThemeBuilder<ButtonTheme>()
    .slot('Button', {
      width: 100
    })
  const ButtonTheme2 = new ThemeBuilder<ButtonTheme>()
    .slot('Button', {
      width: 200
    })

  const ButtonTheme3 = ButtonTheme1.merge(ButtonTheme2)
  const ButtonTheme4 = ButtonTheme1.merge(ButtonTheme2)

  expect(ButtonTheme3).toBe(ButtonTheme4)
})

test('mergeStyles - sort', () => {
  const styles = mergeStyles(['', {}, () => {}, '', {}, {}, () => {}])

  expect(styles).toMatchSnapshot()
})

test('mergeStyles - merge', () => {
  const styles = mergeStyles([
    'str1;',
    { one: '1', two: 1 },
    () => {},
    'str2',
    { two: 2 },
    { three: '3', one: 3 },
    () => {}
  ])

  expect(styles).toMatchSnapshot()
})

test('mergeStyles - nested merge', () => {
  const styles = mergeStyles([
    'str1;',
    { one: '1', two: 1, nested: { one: '1', two: '1'} },
    () => {},
    'str2',
    { two: 2 },
    { three: '3', one: 3, nested: { three: 3, two: 3} },
  ])

  expect(styles).toMatchSnapshot()
})

test('compute', () => {
  const ButtonTheme = new ThemeBuilder<ButtonTheme>()
    .slot('Button', [
      {
        shrink: true,
        withProps: true,
      },
      {
        p: 12,
      },
    ], 'div')
    .slot('Text', [
      {
        withProps: true,
        grow: true,
      }
    ])

  const props: ButtonProps = {
    kind: 'flat',
    p: 10,
  }

  const a = ButtonTheme.compute({ breakpoint: [] } as any)(props)
  expect(a).toMatchSnapshot()
})