import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const baseStyle = definePartsStyle({
	tab: {
		fontWeight: 500, // change the font weight
	},
});

export const tabsTheme = defineMultiStyleConfig({ baseStyle });
