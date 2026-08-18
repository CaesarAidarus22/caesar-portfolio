"use client";

import { motion, useReducedMotion } from "framer-motion";
import FlipProfileCard from "./FlipProfileCard";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="about-hero" aria-labelledby="about-title">
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        transition={{ staggerChildren: reduceMotion ? 0 : 0.09 }}
        className="about-hero__copy"
      >
        <motion.div variants={reveal} className="about-kicker">
          <span>01</span>
          About me
        </motion.div>
        <motion.h1 variants={reveal} id="about-title">
          Beyond
          <span>the code.</span>
        </motion.h1>
        <motion.p variants={reveal} className="about-hero__supporting">
          Sosok di balik setiap project.
        </motion.p>
        <motion.p variants={reveal} className="about-hero__intro">
          Saya adalah mahasiswa Informatika di Universitas Syiah Kuala yang tertarik
          pada ruang tempat Software Engineering, Artificial Intelligence, dan digital
          experience yang dirancang dengan matang saling bertemu.
        </motion.p>
        <motion.div variants={reveal} className="about-hero__coordinates" aria-hidden="true">
          <span>INFORMATICS STUDENT</span>
          <span>SOFTWARE + AI</span>
          <span>SYIAH KUALA UNIVERSITY</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: reduceMotion ? 0 : 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="about-hero__portrait"
      >
        <FlipProfileCard />
      </motion.div>
    </section>
  );
}
