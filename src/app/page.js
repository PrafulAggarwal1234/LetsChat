// "use client";

// import { useEffect, useState } from "react";
// import { socket } from "../socket";

// export default function Home() {
//   const [isConnected, setIsConnected] = useState(false);
//   const [transport, setTransport] = useState("N/A");

//   useEffect(() => {
//     if (socket.connected) {
//       onConnect();
//     }

//     function onConnect() {
//       setIsConnected(true);
//       setTransport(socket.io.engine.transport.name);

//       socket.io.engine.on("upgrade", (transport) => {
//         setTransport(transport.name);
//       });
//     }

//     function onDisconnect() {
//       setIsConnected(false);
//       setTransport("N/A");
//     }

//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("disconnect", onDisconnect);
//     };
//   }, []);

//   const handleClick = ()=>{
//     socket.emit("catch","nice weather!")
//   }

//   return (
//     <div>
//       <p>Status: { isConnected ? "connected" : "disconnected" }</p>
//       <p>Transport: { transport }</p>
//       <button onClick={handleClick}>click me</button>
//     </div>
//   );
// }
'use client'
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  // Redirect to '/auth' on page load
  router.replace('/auth');

  return <div>Redirecting....</div>;
};

export default Page;