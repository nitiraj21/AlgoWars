import { motion } from "framer-motion";

const images = [
  { src: "./Java2.png", color: "rgba(255, 0, 0, 0.08)" },     
  { src: "./CPP.png", color: "rgba(0, 122, 255, 0.7)" },    
  { src: "./js.png", color: "rgba(255, 204, 0, 0)" },     
  { src: "./Python.png", color: "rgba(53, 114, 165, 0.3)" } 
];


export default function SupportedLanguages() {
  return (
    
      <div
        className="mb-10 bg-black/80 transform hover:scale-103 transition-transform duration-400 ease-in-out  overflow-hidden
         bg-gradient-to-r from-gray-700/15 to-gray-500/15 backdrop-blur-lg relative mt-16 mx-16 md:mx-33 px-6 flex flex-col items-center
          border-2 border-slate-600 cursor-pointer rounded-2xl py-12 mb-10 z-50 hover:shadow-[0_0_40px_10px_rgba(80,120,200,0.2)] "
    >
      <div className="">
  <div className="relative z-10 ">
    <h1 className="text-2xl md:text-5xl font-xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
      We Support Your Favourite Languages
    </h1>

    <div className="grid grid-cols-2 md:grid-cols-4 justify-center items-center gap-10 mt-12">
      {images.map((img, index) => (
        <div key={index} className="p-6 rounded-full">
          <img
            src={img.src}
            alt={`Language ${index + 1}`}
            className={`${img.src === "./js.png" ? "max-h-18 max-w-18 md:h-24 w-24 " : "max-h-20 max-w-20 lg:h-30 md:w-30"} object-contain`}

          />
        </div>
      ))}
    </div>
  </div>
</div>
</div>

  );
}
