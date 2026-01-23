import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

// UI / Navigation
import BackCircle from '../../assets/icons/angle-circle-left.svg';
import ChevronDown from '../../assets/icons/angle-down.svg';
import ChevronLeft from '../../assets/icons/angle-left.svg';
import ChevronRight from '../../assets/icons/angle-right.svg';
import ChevronUp from '../../assets/icons/angle-up.svg';

import Home from '../../assets/icons/home.svg';
import Stats from '../../assets/icons/stats.svg';
import Settings from '../../assets/icons/settings.svg';

// Learning / Rewards
import Book from '../../assets/icons/book-alt.svg';
import Trophy from '../../assets/icons/trophy.svg';
import Star from '../../assets/icons/star.svg';
import GraduationCap from '../../assets/icons/graduation-cap.svg';

// Auth / Users
import SignIn from '../../assets/icons/sign-in-alt.svg';
import SignOut from '../../assets/icons/sign-out-alt.svg';
import User from '../../assets/icons/user.svg';
import UserAdd from '../../assets/icons/user-add.svg';
import UserRemove from '../../assets/icons/delete-user.svg';

// Status / Alerts
import CheckCircle from '../../assets/icons/check-circle.svg';
import XCircle from '../../assets/icons/cross-circle.svg';
import Alert from '../../assets/icons/exclamation.svg';
import Info from '../../assets/icons/info.svg';
import Help from '../../assets/icons/interrogation.svg';

// Time
import Clock from '../../assets/icons/clock.svg';
import ClockActive from '../../assets/icons/clock-active.svg';
import Stopwatch from '../../assets/icons/stopwatch.svg';

// Challenge / Action
import Rocket from '../../assets/icons/rocket-launch.svg';

// Math / Operators
import Plus from '../../assets/icons/add.svg';
import Minus from '../../assets/icons/minus-circle.svg';
import Divide from '../../assets/icons/circle-divide.svg';
import Modulo from '../../assets/icons/modulo-circle.svg';

type SvgComp = FC<SvgProps>;

export const ICONS = {
  // Navigation
  back: BackCircle,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,

  // Main tabs / screens
  home: Home,
  stats: Stats,
  settings: Settings,

  // Learning / rewards
  book: Book,
  trophy: Trophy,
  star: Star,
  graduationCap: GraduationCap,

  // Auth / users
  signIn: SignIn,
  signOut: SignOut,
  user: User,
  userAdd: UserAdd,
  userRemove: UserRemove,

  // Status / misc
  checkCircle: CheckCircle,
  xCircle: XCircle,
  alert: Alert,
  info: Info,
  help: Help,

  // Time
  clock: Clock,
  clockActive: ClockActive,
  stopwatch: Stopwatch,

  // Challenge
  rocket: Rocket,

  // Math
  plus: Plus,
  minus: Minus,
  multiply: XCircle,
  divide: Divide,
  modulo: Modulo,
} as const satisfies Record<string, SvgComp>;

export type IconName = keyof typeof ICONS;
