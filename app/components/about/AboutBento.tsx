"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrainCircuit, Braces, Layers3, Quote } from "lucide-react";

const exploring = [
  "AI Systems",
  "Machine Learning",
  "Data Mining",
  "Software Engineering",
  "Creative Development",
];

export default function AboutBento() {
  const reduceMotion = useReducedMotion();
  const cardMotion = {
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10% 0px" },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <section className="about-story" aria-labelledby="about-story-title">
      <div className="about-section-heading">
        <div className="about-kicker">
          <span>02</span>
          The work beneath the work
        </div>
        <h2 id="about-story-title">Rasa ingin tahu yang tumbuh menjadi sesuatu yang bekerja.</h2>
      </div>

      <div className="about-bento">
        <motion.article {...cardMotion} className="about-bento__card about-bento__exploring">
          <div className="about-bento__icon"><BrainCircuit size={21} /></div>
          <p className="about-bento__label">Currently exploring</p>
          <h3>Hal-hal yang terus saya eksplorasi.</h3>
          <div className="about-bento__topics">
            {exploring.map((item, index) => (
              <span key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}</span>
            ))}
          </div>
        </motion.article>

        <motion.article {...cardMotion} className="about-bento__card about-bento__building">
          <div className="about-bento__icon"><Braces size={21} /></div>
          <p className="about-bento__label">What I build</p>
          <h3>Produk digital yang cerdas.</h3>
          <p>
            Saya suka menggabungkan software, AI, data, dan interface yang berguna
            menjadi sistem yang membuat ide kompleks lebih mudah digunakan.
          </p>
          <div className="about-build-diagram" aria-hidden="true">
            <span>Software</span><i />
            <span>AI</span><i />
            <span>Data</span><i />
            <span>Interface</span>
          </div>
        </motion.article>

        <motion.article {...cardMotion} className="about-bento__card about-bento__philosophy">
          <Quote className="about-bento__quote" aria-hidden="true" />
          <div>
            <p className="about-bento__label">Personal philosophy</p>
            <h3>Always curious.<br />Always building.</h3>
          </div>
          <div className="about-bento__philosophy-copy">
            <Layers3 size={22} />
            <p>
              Saya menikmati proses belajar melalui project, eksperimen, dan upaya
              mengubah ide menjadi produk digital yang benar-benar bekerja.
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
