import type { Colors } from '../../theme/types';
import { StyleSheet } from 'react-native';

const makeButtonStyles = (colors: Colors) =>
  StyleSheet.create({
    l: {
      /** Width is auto */
      height: 48,
      paddingHorizontal: 44,
    },

    m: {
      width: 272,
      height: 44,
      paddingHorizontal: 20,
    },

    s: {
      width: 146,
      height: 40,
      paddingHorizontal: 20,
    },

    xs: {
      width: 68,
      height: 40,
      paddingHorizontal: 12,
    },

    /** Generic button styles */
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
      minHeight: 40,
      minWidth: 68,
    },

    /** Primary button styles */
    primaryButtonDefault: {
      backgroundColor: colors.primary[400],
    },
    primaryButtonPressed: {
      backgroundColor: colors.primary[600],
    },
    primaryButtonDisabled: {
      backgroundColor: colors.grey[200],
    },
    primaryButtonDanger: {
      backgroundColor: colors.infoError.toString(),
    },
    primaryButtonDangerPressed: {
      backgroundColor: colors.red[700],
    },

    /** Secondary Light button styles */
    secondaryLightButtonDefault: {
      backgroundColor: colors.white.toString(),
      borderColor: colors.primary[400],
      borderWidth: 2,
    },
    secondaryLightButtonPressed: {
      backgroundColor: colors.grey[25],
      borderColor: colors.primary[600],
      borderWidth: 2,
    },
    secondaryLightButtonDisabled: {
      backgroundColor: colors.white.toString(),
      borderColor: colors.grey[200],
      borderWidth: 2,
    },
    secondaryLightButtonDanger: {
      backgroundColor: colors.white.toString(),
      borderColor: colors.infoError.toString(),
      borderWidth: 2,
    },
    secondaryLightButtonDangerPressed: {
      backgroundColor: colors.white.toString(),
      borderColor: colors.infoError.toString(),
      borderWidth: 2,
    },

    /** Secondary Dark button styles */
    secondaryDarkButtonDefault: {
      backgroundColor: colors.grey[900],
      borderColor: colors.primary[400],
      borderWidth: 2,
    },
    secondaryDarkButtonPressed: {
      backgroundColor: colors.primary[600], // FIXME: Apply an alpha of 0.2
      borderColor: colors.primary[600],
      borderWidth: 2,
    },
    secondaryDarkButtonDisabled: {
      backgroundColor: colors.grey[600],
      borderColor: colors.grey[600],
      borderWidth: 2,
    },
    secondaryDarkButtonDanger: {
      backgroundColor: colors.grey[900],
      borderColor: colors.infoError.toString(),
      borderWidth: 2,
    },
    secondaryDarkButtonDangerPressed: {
      backgroundColor: colors.grey[900],
      borderColor: colors.red[600],
      borderWidth: 2,
    },

    /** Generic text styles */
    text: {
      fontSize: 15,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      lineHeight: 24,
      letterSpacing: 0.25,
      textAlign: 'center',
      marginHorizontal: 4,
    },

    xsText: {
      fontSize: 12,
      fontFamily: 'Avenir Next',
      fontWeight: 'bold',
      lineHeight: 20,
      letterSpacing: 0.1,
      textAlign: 'center',
      marginHorizontal: 4,
    },

    textUppercase: {
      textTransform: 'uppercase',
    },

    /** Primary text styles */
    primaryTextDefault: {
      color: colors.white.toString(),
    },
    primaryTextPressed: {
      color: colors.white.toString(),
    },
    primaryTextDisabled: {
      color: colors.white.toString(),
    },
    primaryTextDanger: {
      color: colors.white.toString(),
    },
    primaryTextDangerPressed: {
      color: colors.white.toString(),
    },

    /** Secondary Light text styles */
    secondaryLightTextDefault: {
      color: colors.primary[400],
    },
    secondaryLightTextPressed: {
      color: colors.primary[600],
    },
    secondaryLightTextDisabled: {
      color: colors.grey[200],
    },
    secondaryLightTextDanger: {
      color: colors.infoError.toString(),
    },
    secondaryLightTextDangerPressed: {
      color: colors.red[700],
    },

    /** Secondary Dark text styles */
    secondaryDarkTextDefault: {
      color: colors.white.toString(),
    },
    secondaryDarkTextPressed: {
      color: colors.grey[50],
    },
    secondaryDarkTextDisabled: {
      color: colors.grey[50],
    },
    secondaryDarkTextDanger: {
      color: colors.infoError.toString(),
    },
    secondaryDarkTextDangerPressed: {
      color: colors.red[700],
    },
  });

export default makeButtonStyles;
