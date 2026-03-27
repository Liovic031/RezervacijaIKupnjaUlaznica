import { IME_APLIKACIJE } from "../constants";
import events from "../assets/events.png"

export default function Home(){
    return(
    <>

        <h1>Dobrodošli na {IME_APLIKACIJE}</h1>
        <div>
            <img src={events} alt="events" style={{width: "100%", borderRadius: "20px"}}/>
        </div>

    </>
    )
}