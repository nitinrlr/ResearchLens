"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Real papers, hardcoded so the hero never waits on the database.
const PAPERS = [
  { title: "Attention Is All You Need", authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit", abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best performing models also connect the encoder and decoder through an attention mechanism." },
  { title: "Deep Residual Learning for Image Recognition", authors: "Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun", abstract: "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously." },
  { title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", authors: "Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova", abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers." },
  { title: "You Only Look Once: Unified, Real-Time Object Detection", authors: "Joseph Redmon, Santosh Divvala, Ross Girshick, Ali Farhadi", abstract: "We present YOLO, a new approach to object detection. Prior work on object detection repurposes classifiers to perform detection." },
  { title: "Playing Atari with Deep Reinforcement Learning", authors: "Volodymyr Mnih, Koray Kavukcuoglu, David Silver, Alex Graves", abstract: "We present the first deep learning model to successfully learn control policies directly from high-dimensional sensory input using reinforcement learning." },
  { title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale", authors: "Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov, Dirk Weissenborn", abstract: "While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited." },
  { title: "Neural Machine Translation by Jointly Learning to Align and Translate", authors: "Dzmitry Bahdanau, Kyunghyun Cho, Yoshua Bengio", abstract: "Neural machine translation is a recently proposed approach to machine translation. Unlike the traditional statistical machine translation, it aims at building a single neural network." },
  { title: "Explaining and Harnessing Adversarial Examples", authors: "Ian Goodfellow, Jonathon Shlens, Christian Szegedy", abstract: "Several machine learning models, including neural networks, consistently misclassify adversarial examples." },
  { title: "Mask R-CNN", authors: "Kaiming He, Georgia Gkioxari, Piotr Dollár, Ross Girshick", abstract: "We present a conceptually simple, flexible, and general framework for object instance segmentation." },
  { title: "A Simple Framework for Contrastive Learning of Visual Representations", authors: "Ting Chen, Simon Kornblith, Mohammad Norouzi, Geoffrey E. Hinton", abstract: "This paper presents SimCLR: a simple framework for contrastive learning of visual representations." },
];

const PERSPECTIVE = 1200;
const WIDTH = 320;
const HEIGHT = 414;

// Papers fade out between these points on screen (0 = top, 1 = bottom).
const FADE_START = 0.5;
const FADE_END = 0.85;

// Near papers keep to the edges, so only dim ones cross behind the headline.
// lane: across the screen (0-1). depth: px behind the screen. start: fall progress (0-1).
const FLIGHTS = [
  { lane: 0.07, depth: 0, start: 0.16, tilt: -14, phone: true },
  { lane: 0.93, depth: 0, start: 0.63, tilt: 12, phone: true },
  { lane: 0.19, depth: 380, start: 0.74, tilt: 9 },
  { lane: 0.81, depth: 380, start: 0.24, tilt: -11 },
  { lane: 0.02, depth: 500, start: 0.46, tilt: 16 },
  { lane: 0.99, depth: 520, start: 0.92, tilt: -7 },
  { lane: 0.36, depth: 1000, start: 0.06, tilt: 6, phone: true },
  { lane: 0.64, depth: 1000, start: 0.52, tilt: -8, phone: true },
  { lane: 0.5, depth: 1200, start: 0.86, tilt: 11 },
  { lane: 0.13, depth: 1100, start: 0.32, tilt: -5 },
];

export default function FallingPapers() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = root.current!;
    const flights = FLIGHTS.map((flight, index) => {
      const element = container.children[index] as HTMLElement;

      return {
        ...flight,
        element,
        shade: element.querySelector<HTMLElement>("[data-shade]")!,
        dimmer: element.querySelector<HTMLElement>("[data-dim]")!,
        spread: 1 + flight.depth / PERSPECTIVE, // converts screen px to 3D px
        fallSeconds: 26 + flight.depth * 0.035,
        scrollSpeed: 1.3 - flight.depth * 0.0008,
        dim: flight.depth >= 1000 ? 0.66 : flight.depth / 2500,
        seed: index * 1.7,
        distance: 0,
      };
    });

    let width = 0;
    let height = 0;
    let size = 1;

    function place(flight: (typeof flights)[number]) {
      const margin = (HEIGHT * size * 0.8) / flight.spread + 60;
      const travel = height + margin * 2;
      const fallen = flight.start * travel + flight.distance;
      const screenY = ((fallen % travel) + travel) % travel - margin;
      const y = (screenY - height / 2) * flight.spread;
      const phase = flight.seed + (flight.distance / travel) * Math.PI * 2.5;
      const x = ((flight.lane - 0.5) * width + Math.sin(phase) * 36) * flight.spread;

      // Angles stay small enough that the front of the page always faces us.
      const turn = Math.sin(phase + 0.8);
      const rotateX = 14 + 20 * Math.sin(phase * 0.6 + flight.seed);
      const rotateZ = flight.tilt + 12 * Math.cos(phase);

      flight.element.style.transform =
        `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${-flight.depth}px) ` +
        `rotateX(${rotateX.toFixed(2)}deg) rotateY(${(38 * turn).toFixed(2)}deg) ` +
        `rotateZ(${rotateZ.toFixed(2)}deg) scale(${size})`;

      flight.element.style.opacity = gsap.utils.clamp(0, 1, (FADE_END - screenY / height) / (FADE_END - FADE_START)).toFixed(3);
      flight.shade.style.opacity = Math.abs(turn).toFixed(3);
      flight.shade.style.transform = `scaleX(${turn < 0 ? -1 : 1})`;
    }

    function measure() {
      width = container.clientWidth;
      height = container.clientHeight;
      size = gsap.utils.clamp(0.55, 1, width / 1440);
      const isPhone = width < 768;

      for (const flight of flights) {
        flight.element.style.display = isPhone && !flight.phone ? "none" : "";
        flight.dimmer.style.opacity = String(isPhone ? Math.max(flight.dim, 0.6) : flight.dim);
        place(flight);
      }
    }

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    gsap.to(container, { autoAlpha: 1, duration: 1.4, ease: "power1.out" });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => resizeObserver.disconnect();
    }

    let visible = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    let lastScroll = window.scrollY;

    function fall(_time: number, deltaMs: number) {
      const scrolled = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (!visible) return;

      // Capped so returning to a background tab doesn't jump the papers.
      const seconds = Math.min(deltaMs / 1000, 0.1);

      for (const flight of flights) {
        flight.distance += (height / flight.fallSeconds) * seconds + scrolled * flight.scrollSpeed;
        place(flight);
      }
    }

    gsap.ticker.add(fall);

    return () => {
      gsap.ticker.remove(fall);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, { scope: root });

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none invisible absolute inset-0 overflow-hidden" style={{ perspective: PERSPECTIVE }}>
      {FLIGHTS.map((flight, index) => (
        <div
          key={index}
          className="absolute left-1/2 top-1/2"
          style={{ width: WIDTH, height: HEIGHT, margin: `${-HEIGHT / 2}px 0 0 ${-WIDTH / 2}px`, transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {flight.depth < 400 && (
            <>
              <div className="absolute inset-0 bg-[#d9def0]" style={{ transform: "translate3d(7px, 8px, -8px) rotateZ(1.6deg)" }} />
              <div className="absolute inset-0 bg-[#eef1fa]" style={{ transform: "translate3d(3px, 4px, -4px) rotateZ(0.7deg)" }} />
            </>
          )}
          <PaperPage paper={PAPERS[index]} soft={flight.depth >= 1000} />
        </div>
      ))}
    </div>
  );
}

function PaperPage({ paper, soft }: { paper: (typeof PAPERS)[number]; soft: boolean }) {
  const lines = "bg-[repeating-linear-gradient(to_bottom,#c9cfe3_0_2px,transparent_2px_7px)]";

  return (
    <div className={`absolute inset-0 flex flex-col overflow-hidden bg-white px-7 py-8 text-center text-[#14193a] shadow-[0_30px_60px_-18px_rgb(3_8_30/0.65)] ${soft ? "blur-[1.5px]" : ""}`}>
      <p className="font-serif text-[21px] leading-[1.15]">{paper.title}</p>
      <p className="mt-2.5 text-[8.5px] leading-snug text-[#4a5270]">{paper.authors}</p>
      <p className="mt-4 text-[8.5px] font-semibold">Abstract</p>
      <p className="mt-1 text-justify text-[8.5px] leading-[1.4] text-[#2c3350]">{paper.abstract}</p>

      <div className="mt-4 grid min-h-0 flex-1 grid-cols-2 gap-3">
        <div className={lines} />
        <div className={lines} />
      </div>

      <div data-shade className="absolute inset-0 bg-[linear-gradient(100deg,transparent_25%,rgb(15_30_84/0.5))] opacity-0" />
      <div data-dim className="absolute inset-0 bg-night opacity-0" />
    </div>
  );
}
