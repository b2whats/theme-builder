type Phase = 'normal' | 'hover' | 'press' | 'focus'
export interface ButtonProps {
  /** Иконка слева */
  children?: any
  /** Иконка слева */
  iconBefore?: React.ReactChild | ((phase: Phase) => React.ReactChild)
  /** Иконка справа */
  iconAfter?: React.ReactChild
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
  variant?: 'primary' | 'secondary'
}