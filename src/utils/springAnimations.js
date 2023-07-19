import { useSpring } from "@react-spring/web";

export const bounceInLeft = () => {
  return useSpring({
    from: { transform: "translateX(-40px)" },
    to: { transform: "translateX(0%)" },
    config: { duration: 500 },
  });
};

export const bounceInRight = () => {
  return useSpring({
    from: { transform: "translateX(40px)" },
    to: { transform: "translateX(0%)" },
    config: { duration: 500 },
  });
};
