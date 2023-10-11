function Header({ setMode }) {
  return (
    <div className="header-bar">
      <div className="title">Quizzy Tales</div>
      <div className="links">
        <a href="#story" onClick={() => setMode("story")}>
          Story Generator
        </a>
        <a href="#quiz" onClick={() => setMode("quiz")}>
          Quiz Maker
        </a>
      </div>
    </div>
  );
}

export default Header;
