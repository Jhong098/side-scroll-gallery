import Sketch from "./app";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const animation = new Sketch({
  dom: document.getElementById("container"),
});

gsap.to(animation.settings, {
  duration: 2,
  progress: 1,
  ease: "expo.inOut",
});

const container = document.getElementById("wrapper");
gsap.to(".wrapper", {
  x: -(container.scrollWidth - document.documentElement.clientWidth) + "px",
  scrollTrigger: {
    trigger: "#container",
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      animation.time = self.progress * 40;
    },
  },
});
