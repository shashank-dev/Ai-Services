
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center my-8 md:my-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
        AI Photo Blender
      </h1>
      <p className="mt-4 text-lg max-w-2xl mx-auto text-slate-400">
        Seamlessly add a person to a group photo. The AI will blend them in, matching lighting and style, to create a flawless, original-looking picture.
      </p>
    </header>
  );
};

export default Header;
