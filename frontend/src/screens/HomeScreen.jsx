import { Wrench } from "lucide-react";

function HomeScreen() {
  return (
    <div>
      <div className="home-background"></div>
      <div className="home-content">
        <Wrench className="home-watermark-icon" />
      </div>
    </div>
  );
}

export default HomeScreen;
