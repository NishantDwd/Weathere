import { CloudSun, Heart, Target, Gift, User } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-2xl p-8 backdrop-blur-lg">
      <div className="flex items-center gap-3 mb-6">
        <CloudSun className="w-10 h-10 text-indigo-400" />
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 tracking-tight">
          About Weathere
        </h1>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2 text-fuchsia-600 mb-2">
          <Heart className="w-5 h-5" /> Dedication
        </h2>
        <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed">
          Weathere is crafted with passion and precision to empower everyone with accurate, real-time weather information. Our dedication is to make weather forecasting accessible, beautiful, and reliable for all.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 mb-2">
          <Target className="w-5 h-5" /> Our Goals
        </h2>
        <ul className="list-disc ml-8 text-zinc-700 dark:text-zinc-200 space-y-1">
          <li>Deliver precise and up-to-date weather data for any city worldwide.</li>
          <li>Provide a seamless, interactive, and visually appealing user experience.</li>
          <li>Enable users to save favorites, view search history, and plan ahead with 5-day forecasts.</li>
          <li>Promote weather awareness and safety through timely alerts and warnings.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-600 mb-2">
          <Gift className="w-5 h-5" /> What We Provide
        </h2>
        <ul className="list-disc ml-8 text-zinc-700 dark:text-zinc-200 space-y-1">
          <li>Current weather and animated backgrounds for immersive experience.</li>
          <li>5-day animated forecast with detailed metrics.</li>
          <li>Favorites and search history management.</li>
          <li>Responsive, modern UI with dark mode support.</li>
          <li>Instant notifications for actions and alerts.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-600 mb-2">
          <User className="w-5 h-5" /> About Me
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src="https://api.dicebear.com/8.x/initials/svg?seed=Nishant"
            alt="Nishant"
            className="w-20 h-20 rounded-full border-4 border-indigo-200 shadow-lg"
          />
          <div>
            <div className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Nishant Dwivedi</div>
            <div className="text-zinc-600 dark:text-zinc-300 mb-2">
              Full Stack Developer | UI/UX Enthusiast | User-friendly Content
            </div>
            <p className="text-zinc-700 dark:text-zinc-200">
              Hi! I’m Nishant, the creator of Weathere. I love building beautiful, useful apps that make life easier and more informed. This project is a blend of my passion for technology and fascination with real world problems that users face. 
              <br/>Thank you for using Weathere!
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 text-center text-zinc-500 dark:text-zinc-400 text-sm">
        &copy; {new Date().getFullYear()} Weathere &mdash; Made with <span className="text-red-400">♥</span> by Nishant
      </div>
    </div>
  );
}