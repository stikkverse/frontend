const BackgroundGrid = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 gridBg"
      />

      <div
        aria-hidden="true"
        className="fixed left-0 right-0 h-0.75 pointer-events-none z-1 animateLine bg-linear-to-br from-transparent via-(--scanline-color) to-transparent"
      />
    </>
  );
}

export default BackgroundGrid