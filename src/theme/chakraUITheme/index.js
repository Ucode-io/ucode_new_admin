import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import colors from './colors';
import { tabsTheme } from './components/Tab.theme';
const chakraUITheme = extendTheme(
	{
		colors,
		components: {
			Input: {
				defaultProps: {
					focusBorderColor: 'primary.500',
				},
			},
			Modal: {
				defaultProps: {
					isCentered: true,
					scrollBehavior: 'inside',
				},
			},
			Tabs: tabsTheme,
			Button: {
				variants: {
					outline: (props) => {
						return {
							color: `${props.colorScheme}.500`,
						};
					},
					ghost: (props) => {
						return {
							color: `${props.colorScheme}.500`,
						};
					},
				},
				// baseStyle: {
				//   borderRadius: '8px',
				// },
			},
			// Badge: {
			//   baseStyle: {
			//     borderRadius: '28px',
			//   }
			// }
		},
	},
	withDefaultColorScheme({
		colorScheme: 'primary',
	})
);

export default chakraUITheme;
