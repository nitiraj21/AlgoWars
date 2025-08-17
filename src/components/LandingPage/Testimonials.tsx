import React from 'react'

export default function Testimonials() {
    const testimonials = [
      { name: "Alice", text: "This platform is a game changer!" },
      { name: "Bob", text: "Helped me improve my coding skills fast." },
      { name: "Charlie", text: "I love how simple and effective it is." },
      { name: "Diana", text: "Feels like magic ✨ Highly recommend!" }
    ];
  
    return (
      <div className="overflow-hidden w-full py-10 mb-15">
        <div className="flex animate-marquee whitespace-nowrap">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="min-w-[300px] bg-zinc-900 rounded-2xl p-6 mx-4 shadow-lg flex flex-wrap text-center"
            >
              <p className="text-md text-zinc-200 italic">"{t.text}"</p>
              <p className="mt-3 text-sm text-zinc-400">— {t.name}</p>
            </div>
          ))}
  
          {/* duplicate for smooth looping */}
          {testimonials.map((t, i) => (
            <div
              key={`dup-${i}`}
              className="min-w-[300px] bg-zinc-900 rounded-2xl p-6 mx-4 shadow-lg text-center flex flex-wrap"
            >
              <p className="text-md text-zinc-200 italic">"{t.text}"</p>
              <p className="mt-3 text-sm text-zinc-400">— {t.name}</p>
            </div>
          ))}

          {testimonials.map((t, i) => (
            <div
              key={`dup-${i}`}
              className="min-w-[300px] bg-zinc-900 rounded-2xl p-6 mx-4 shadow-lg text-center flex flex-wrap"
            >
              <p className="text-md text-zinc-200 italic">"{t.text}"</p>
              <p className="mt-3 text-sm text-zinc-400">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
