"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WritingAnimation() {
  const text = "Weatherly";
  const [displayText, setDisplayText] = useState("");


  return (
    <h1 className="text-4xl font-lobster sm:text-6xl font-bold text-center drop-shadow-lg">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: -10 }} // Start faded and slightly left
          animate={{
            opacity: index < displayText.length ? 0 : 1, // Show when index matches
            x: 0,
          }}
          transition={{ duration: 1, delay: index * 0.1 }} // Delay each letter
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </h1>
  );
}
