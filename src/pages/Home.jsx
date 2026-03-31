import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { IME_APLIKACIJE } from "../constants";
import events from "../assets/events.png";
import ticketAnimation from "../assets/animations/ticketblue.lottie";

export default function Home() {
  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        Dobrodošli na {IME_APLIKACIJE}
      </h1>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <DotLottieReact
          src={ticketAnimation}
          loop={true}
          autoplay={true}
          style={{ width: 300, height: 300 }}
        />
      </div>

      <div>
        <img
          src={events}
          alt="events"
          style={{ width: "100%", borderRadius: "20px" }}
        />
      </div>
    </>
  );
}