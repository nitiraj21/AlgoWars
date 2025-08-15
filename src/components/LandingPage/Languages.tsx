import { motion } from "framer-motion";

const images = [
  "./Java2.png",
  "./CPP.png",
  "./js.png",
  "./Python.png"
];

export default function SupportedLanguages() {
  return (
    <div className="relative mt-16 w-full flex flex-col items-center py-20 z-50 mb-60 overflow-hidden">


      <div data-aos="fade-down" className="relative z-10">
        <h1 className="text-3xl md:text-6xl font-xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          We Support Your Favourite Languages
        </h1>

        <div   className="flex flex-wrap justify-center items-center gap-12 mt-25">
          {images.map((src, index) => (
            <div  key={index} className="flex justify-center items-center">
              <img
                src={src}
                alt={`Language ${index + 1}`}
                className="h-28 w-28 md:h-40 md:w-40 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
