
import StarryCanvas from "@/components/StarryCanvas";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <StarryCanvas />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <span className="text-sm uppercase tracking-wider mb-2 opacity-75">Welcome to</span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center">
          Celestial Canvas
        </h1>
        <p className="text-lg md:text-xl text-center max-w-2xl mx-auto px-4 opacity-90">
          An interactive journey through a dynamic starfield, where each point of light responds to your movement.
        </p>
      </div>
    </div>
  );
};

export default Index;
