import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import SpriteEyes from "../assets/spriteEyes.png";
import SpriteBody from "../assets/sprite2.png";

const guideSteps = [
  "✨ Welcome to Irys Amplifiers — Begin by gently entering your X username into the search bar, then click ‘Search’ to reveal your rank.",
  "🌿 Once your card appears, explore different timeframes — simply change it and click ‘Search’ again to discover more stats.",
  "🎨 Choose the theme that feels right for you — Classic (default), Vibrant, or Dark — and see your card transform.",
  "📥 Download your beautiful card and proudly share it on X.",
  "💾 To treasure your card forever: Visit the Irys Gallery, connect your X and wallet → return to Profile Creation, search again, and click ‘Upload’ beneath your card to store it on Irys forever.",
  "🌍 Finally, wander through the Irys Gallery and admire the stats others have shared."
];


export default function MainCharacter() {
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedStep, setDisplayedStep] = useState(0);
  const [typedText, setTypedText] = useState("");

  const mascotRef = useRef(null);
  const eyesRef = useRef(null);
  const guideRef = useRef(null);
  const stepTextRef = useRef(null);
  const typingTimeout = useRef(null);

  // Breathing
  useEffect(() => {
    gsap.to(mascotRef.current, {
      scale: 1.05,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut"
    });
  }, []);

  // Blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      gsap.to(eyesRef.current, {
        scaleY: 0.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
      });
    }, Math.random() * 3000 + 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Show guide
  useEffect(() => {
    if (showGuide) {
      gsap.fromTo(
        guideRef.current,
        { opacity: 0, scale: 0.9, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [showGuide]);

  // Animate text on step change
  useEffect(() => {
    if (!stepTextRef.current) return;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    const tl = gsap.timeline();
    tl.to(stepTextRef.current, {
      opacity: 0,
      x: -20,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        setDisplayedStep(currentStep);
        setTypedText("");
      }
    }).call(() => {
      // Start typing after slide out
      const fullText = `${currentStep + 1}. ${guideSteps[currentStep]}`;
      let i = 0;
      const typeNext = () => {
        setTypedText(fullText.slice(0, i + 1));
        i++;
        if (i < fullText.length) {
          typingTimeout.current = setTimeout(typeNext, 18); // typing speed
        }
      };
      typeNext();
    }).fromTo(
      stepTextRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
    );

    return () => clearTimeout(typingTimeout.current);
  }, [currentStep, showGuide]);

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start">
      {/* Mascot */}
      <div
        ref={mascotRef}
        style={{
          width: 100,
          position: "relative",
          display: "inline-block",
          cursor: "pointer"
        }}
        onClick={() => setShowGuide((prev) => !prev)}
      >
        <img src={SpriteBody} alt="Body" style={{ width: "100%" }} />
        <img
          ref={eyesRef}
          src={SpriteEyes}
          alt="Eyes"
          style={{
            width: "86.9%",
            position: "absolute",
            top: "14%",
            left: "7.35%",
            transformOrigin: "center center"
          }}
        />
      </div>

      {/* Guide Box */}
      {showGuide && (
        <div
          ref={guideRef}
          className="mt-2 p-4 rounded-xl bg-white/90 shadow-lg max-w-xs text-sm border border-gray-200"
        >
          <p ref={stepTextRef} className="mb-4 whitespace-pre-line">
            {typedText}
          </p>

          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-3 py-1 rounded-lg text-white text-xs ${
                currentStep === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-500 text-xs">
              Step {currentStep + 1} / {guideSteps.length}
            </span>
            <button
              onClick={nextStep}
              disabled={currentStep === guideSteps.length - 1}
              className={`px-3 py-1 rounded-lg text-white text-xs ${
                currentStep === guideSteps.length - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
