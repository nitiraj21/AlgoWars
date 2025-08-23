import React from 'react'

export default function Testimonials() {
    const testimonials = [
      { name: "Goutam", text: "This platform is a game changer!" },
      { name: "Bobby", text: "Helped me improve my coding skills fast." },
      { name: "Aryan", text: "I love how simple and effective it is." },
      { name: "Abhay", text: "Feels like magic ✨ Highly recommend!" },
      { name: "Raghav", text: "Gamified my learnings" }
    ];
  
    return (
      <div className="overflow-hidden w-full py-10 mb-15">
        <div className="flex animate-marquee whitespace-nowrap">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="min-w-[350px] bg-slate-500 rounded-2xl p-6 mx-4 shadow-lg "
            >
              <p className="text-md text-zinc-200 italic">"{t.text}"</p>
              <p className="mt-3 text-sm text-zinc-400">— {t.name}</p>
            </div>
          ))}
  
          {/* duplicate for smooth looping */}
          {testimonials.map((t, i) => (
            <div
              key={`dup-${i}`}
              className="min-w-[350px] bg-slate-500 rounded-2xl p-6 mx-4 shadow-lg"
            >
              <p className="text-md text-zinc-200 italic">"{t.text}"</p>
              <p className="mt-3 text-sm text-zinc-400">— {t.name}</p>
            </div>
          ))}

          {testimonials.map((t, i) => (
            <div
              key={`dup-${i}`}
              className="min-w-[350px] bg-slate-500 rounded-2xl p-6 mx-4 shadow-lg "
            >
              <p className="text-md text-zinc-200 italic">"{t.text}"</p>
              <p className="mt-3 text-sm text-zinc-400">— {t.name}</p>
            </div>
          ))}
          {testimonials.map((t, i) => (
            <div
              key={`dup-${i}`}
              className="min-w-[350px] bg-slate-500 rounded-2xl p-6 mx-4 shadow-lg "
            >
              <p className="text-md text-zinc-200 italic">"{t.text}"</p>
              <p className="mt-3 text-sm text-zinc-400">— {t.name}</p>
            </div>
          ))}
          {testimonials.map((t, i) => (
            <div
              key={`dup-${i}`}
              className="min-w-[350px] bg-slate-500 rounded-2xl p-6 mx-4 shadow-lg "
            >
              <p className="text-md text-zinc-200 italic">"{t.text}"</p>
              <p className="mt-3 text-sm text-zinc-400">— {t.name}</p>
            </div>
          ))}
          {testimonials.map((t, i) => (
            <div
              key={`dup-${i}`}
              className="min-w-[350px] bg-slate-500 rounded-2xl p-6 mx-4 shadow-lg "
            >
              <p className="text-md text-zinc-200 italic">"{t.text}"</p>
              <p className="mt-3 text-sm text-zinc-400">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
