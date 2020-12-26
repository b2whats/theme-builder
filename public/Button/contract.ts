import { StyleProperties } from '../../src/StyleProperties'

export interface ButtonProps extends StyleProperties {
  /** Иконка слева */
  children?: any
  /** Иконка слева */
  iconBefore?: React.ReactNode
  /** Иконка справа */
  iconAfter?: React.ReactNode
  /** Размер кнопки */
  size?: 's' | 'm' | 'l'
  /** Имя кнопки */
  name?: string
  /** Значение кнопки */
  value?: string | number
  /** Внешний вид кнопки */
  kind?: 'fill' | 'outline' | 'flat'
  /** Нажатое состояние кнопки */
  checked?: boolean
  /** Действие которое совершает кнопка */
  type?: 'button' | 'submit' | 'reset'
  /** Кнопка со спиннером */
  loading?: boolean
  /** Квадратная круглая и вытянутая форма с закругленными углами */
  shape?: 'pill' | 'square' | 'circle'
  /** Ссылка для перехода */
  href?: string
}