import StarryCanvas from "@/components/StarryCanvas";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <StarryCanvas />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white select-none">
        <span className="text-sm uppercase tracking-wider mb-2 opacity-75 starry-text">欢迎来到</span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center starry-text">
          星空画布
        </h1>
        <p className="text-lg md:text-xl text-center max-w-2xl mx-auto px-4 opacity-90 starry-text">
          一段穿越动态星空的互动之旅，每一个光点都会随着你的移动而变化。
        </p>
      </div>
    </div>
  );
};

export default Index;
