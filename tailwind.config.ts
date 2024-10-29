import type { Config } from "tailwindcss";
export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        mauve: "#020420", //темный
        charcoal: "#34495E", //серый
        marengo: "#d6d6d6", // белый 
        savoy: "#00DC82", //светло-зеленый
				darkGreen: "#41B883", //светло-зеленый
      },
			height: {
        '110': '110%',
      }
    },
  },
};
