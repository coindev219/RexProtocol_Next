import React, { useEffect, useRef } from "react";



export default function MintingFormComponent() {

const iframeRef:any = useRef(null);


  return (
    <>
      <div className="flex flex-col items-center mt-20 text-center justify-center">
        <iframe
          ref={iframeRef}
          src="https://docs.google.com/forms/d/e/1FAIpQLSdZGd4KpXOTEaCHYqmNpLOyQvGpz9H_h-OnFk6pigOz3Yvavw/viewform?embedded=true"
  
          style={{ height: '800px', marginBottom: '.7rem' }}
          className="w-full md:w-1/2"

        >
          Loading…
        </iframe>
      </div>
    </>
  );
}
