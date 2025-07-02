import { Theme } from '@react-navigation/native';

export const STYLESHEET_MIN_HEIGHT_DIVIDER = {
  height: 1,
};

export const STYLESHEET_MIN_BORDER_SOCIAL_BUTTON = {
  borderWidth: 1,
};

export const STYLESHEET_BOTTOMSHEET_BG = {
  borderTopLeftRadius: 50,
  borderTopRightRadius: 50,
};

export const STYLESHEET_BOTTOMSHEET_INDICATOR = {
  backgroundColor: '#5980BF',
  marginTop: 10,
};

export const STYLESHEET_BOTTOMSHEET_TAB_BOTTOM = {
  headerShown: false,
  tabBarLabelStyle: { fontSize: 12, paddingBottom: 10 },
  tabBarStyle: {
    height: 75,
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: '#fff',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  tabBarShowLabel: false,
};

export const STYLESHEET_MIN_BORDER_CARD = {
  borderWidth: 1,
  borderColor: '#f3f4f6',
};

export const STYLESHEET_TEXT_11 = {
  fontSize: 11,
};

export type CustomTheme = {
  dark: boolean;
  colors: {
    customColor: string;
    backgroundColor: string;
    backgroundColorCardWash: string;
    borderColorCardWash: string;
    background: string;
    titleText: string;
    textColor: string;
    borderColor: string;
    buttonColor: 'bg-blue' | 'bg-green' | 'bg-orange';
    textLabel: string;
    textPrimary: string;
    textSecondary: string;
    dividers: string;
    checkbox: string;
    titleHeaderNavigation: string;
    bgBottomSheet: string;
    bgModal: string;
    textVerifyCode: string;
    borderButtonShortcut: string;
    bgBottomTab: string;
    expoIcon: string;
    placeholder: string;
  };
} & Theme;

export const LightTheme = {
  dark: false,
  colors: {
    // primary: 'rgb(0, 122, 255)',
    background: '#fff',
    // card: 'rgb(255, 255, 255)',
    // text: 'rgb(28, 28, 30)',
    // border: 'rgb(216, 216, 216)',
    // notification: 'rgb(255, 59, 48)',

    backgroundColor: 'bg-white',
    backgroundColorCardWash: 'bg-white',
    borderColorCardWash: 'border-gray-100',
    titleText: '#374151',
    textColor: 'text-gray-700',
    textLabel: 'text-label',
    textPrimary: 'text-primary',
    textSecondary: 'text-secondary',
    borderColor: 'border-gray-300',
    buttonColor: 'bg-blue',
    dividers: 'bg-gray-200',
    checkbox: '#5980BF',
    titleHeaderNavigation: '#2C2C2C',
    bgModal: 'bg-white',
    textVerifyCode: '#2C2C2C',
    borderButtonShortcut: 'border-gray-400 border-[1px]',
    bgBottomTab: '#FFF',
    expoIcon: '#505050',
    placeholder: '#C4C4C4',
  },
};

export const DarkTheme = {
  dark: true,
  colors: {
    // primary: 'rgb(10, 132, 255)',
    background: '#000',
    // card: 'rgb(18, 18, 18)',
    // text: 'rgb(28, 28, 30)',
    // border: 'rgb(39, 39, 41)',
    // notification: 'rgb(255, 69, 58)',

    backgroundColor: 'bg-black',
    backgroundColorCardWash: 'bg-zinc-800',
    borderColorCardWash: 'border-stone-800',
    titleText: '#d4d4d4',
    textColor: 'text-gray-300',
    textLabel: 'text-labelLigth',
    textPrimary: 'text-white',
    textSecondary: 'text-labelLigth',
    borderColor: 'border-gray-200',
    buttonColor: 'bg-green',
    dividers: 'bg-white',
    checkbox: '#FFFFFF',
    titleHeaderNavigation: '#FFFFFF',
    bgModal: 'bg-stone-800',
    textVerifyCode: '#FFFFFF',
    borderButtonShortcut: 'border-none border-[0px]',
    bgBottomTab: '#000',
    expoIcon: '#FFFFFF',
  },
};

export const STYLESHEET_DIVIDER = {
  height: 1,
  width: '100%',
};

export const STYLESHEET_MIN_BORDER_OUTLINE = {
  borderWidth: 1,
};
